// Arquivo: server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateLightningContract } = require('./lightningContractGenerator');
const { deployLightningContract, checkPaymentStatus } = require('./lightingDeployer');

// Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Middleware para processar JSON no corpo das requisições
app.use(bodyParser.json());

const deployedContracts = new Map();

/**
 * Endpoint para gerar um contrato Lightning Network baseado nos parâmetros do comprador e vendedor
 * 
 * Espera receber um objeto JSON com:
 * - buyerPublicKey: Chave pública do comprador
 * - buyerNodeId: ID do nó Lightning do comprador
 * - sellerPublicKey: Chave pública do vendedor
 * - sellerNodeId: ID do nó Lightning do vendedor
 * - amount: Valor da transação em satoshis
 */
app.post('/api/generate-lightning-contract', (req, res) => {
  try {
    // Extrair parâmetros da requisição
    const { 
      buyerPublicKey, 
      buyerNodeId, 
      sellerPublicKey, 
      sellerNodeId, 
      amount 
    } = req.body;
    
    // Validar os parâmetros recebidos
    if (!buyerPublicKey || !buyerNodeId || !sellerPublicKey || !sellerNodeId || !amount) {
      return res.status(400).json({ 
        error: 'Parâmetros incompletos. Todos os campos são obrigatórios.' 
      });
    }
    
    // Validar que o amount é um número positivo
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        error: 'O valor da transação deve ser um número positivo.' 
      });
    }
    
    // Gerar o contrato Lightning
    const contract = generateLightningContract({
      buyerPublicKey,
      buyerNodeId,
      sellerPublicKey,
      sellerNodeId,
      amount
    });
    
    // Retornar o contrato gerado
    return res.status(200).json({
      success: true,
      contract: contract
    });
    
  } catch (error) {
    console.error('Erro ao gerar contrato Lightning:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao gerar o contrato Lightning.', 
      details: error.message 
    });
  }
});

app.post('/api/deploy-contract', async (req, res) => {
  try {
    const { contract } = req.body;
    
    // Validar que recebemos um contrato válido
    if (!contract || !contract.id || !contract.parties || !contract.transaction) {
      return res.status(400).json({ 
        error: 'Contrato inválido ou incompleto.' 
      });
    }
    
    // Fazer deploy do contrato na Lightning Network
    const deployResult = await deployLightningContract(contract);
    
    // Armazenar o contrato deployado para consulta posterior
    deployedContracts.set(contract.id, {
      ...contract,
      deployStatus: deployResult.status,
      paymentRequest: deployResult.paymentRequest,
      deployedAt: new Date().toISOString()
    });
    
    // Retornar as informações do deploy
    return res.status(200).json({
      success: true,
      contractId: contract.id,
      paymentRequest: deployResult.paymentRequest, // Este é o invoice Lightning que o comprador deve pagar
      expiresAt: deployResult.expiresAt,
      amount: contract.transaction.amount,
      deployStatus: deployResult.status
    });
    
  } catch (error) {
    console.error('Erro ao fazer deploy do contrato:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao fazer deploy do contrato.', 
      details: error.message 
    });
  }
});

/**
 * Endpoint para verificar o status de um contrato deployado
 */
app.get('/api/contract-status/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;
    
    // Verificar se o contrato existe no nosso registro
    if (!deployedContracts.has(contractId)) {
      return res.status(404).json({ 
        error: 'Contrato não encontrado.' 
      });
    }
    
    const contract = deployedContracts.get(contractId);
    
    // Verificar status do pagamento na Lightning Network
    const paymentStatus = await checkPaymentStatus(contract);
    
    // Atualizar o status do contrato com as novas informações
    contract.paymentStatus = paymentStatus.status;
    if (paymentStatus.paidAt) {
      contract.paidAt = paymentStatus.paidAt;
    }
    if (paymentStatus.settledAt) {
      contract.settledAt = paymentStatus.settledAt;
    }
    
    // Retornar o status atual
    return res.status(200).json({
      contractId: contractId,
      status: paymentStatus.status,
      paidAt: paymentStatus.paidAt || null,
      settledAt: paymentStatus.settledAt || null,
      amount: contract.transaction.amount,
      seller: contract.parties.seller.nodeId,
      paymentRequest: contract.paymentRequest
    });
    
  } catch (error) {
    console.error('Erro ao verificar status do contrato:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao verificar status do contrato.', 
      details: error.message 
    });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});