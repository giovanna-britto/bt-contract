"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// URL base da API - ajuste conforme seu ambiente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ContractForm() {
  const router = useRouter()
  const [buyerName, setBuyerName] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [saleValue, setSaleValue] = useState("")
  const [saleObject, setSaleObject] = useState("")
  const [signatureDate, setSignatureDate] = useState<Date | undefined>(undefined)
  const [signatureLocation, setSignatureLocation] = useState("")
  const [observations, setObservations] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!buyerName || !sellerName || !saleValue || !saleObject || !signatureDate || !signatureLocation) {
      setError("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setLoading(true)

    try {
      // Formatação dos dados para corresponder ao ContratoInput do backend
      const contractData = {
        comprador: buyerName,
        vendedor: sellerName,
        valor: saleValue.toString(), // Converte o valor da venda para string
        objeto: saleObject,
        data_assinatura: signatureDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        local_assinatura: signatureLocation,
        observacoes: observations || ""
      };
      
      // Enviar dados para a API
      const response = await fetch(`${API_BASE_URL}/gerar-contrato`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao criar contrato");
      }
      
      // Para download direto do PDF
      if (response.headers.get('content-type') === 'application/pdf') {
        // Criar URL para o blob e abrir em nova aba
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        // Redirecionar para a página de contratos
        router.push("/dashboard");
        return;
      }
      
      // Se a resposta contiver um ID de contrato
      const data = await response.json();
      if (data.id) {
        router.push(`/contracts/${data.id}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error('Erro na criação do contrato:', err)
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao criar o contrato")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link href="/dashboard">
          <Button variant="ghost" className="mr-4 text-gray-400 hover:text-white">
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Novo Contrato</h1>
      </div>

      <Card className="border-gray-800 bg-gray-950">
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
          <CardDescription>Preencha todos os campos obrigatórios para criar um novo contrato</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-md">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buyer's Name */}
              <div className="space-y-2">
                <Label htmlFor="buyerName">Nome do Comprador *</Label>
                <Input
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="bg-gray-900 border-gray-800"
                  placeholder="Nome completo do comprador"
                  required
                />
              </div>

              {/* Seller's Name */}
              <div className="space-y-2">
                <Label htmlFor="sellerName">Nome do Vendedor *</Label>
                <Input
                  id="sellerName"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="bg-gray-900 border-gray-800"
                  placeholder="Nome completo do vendedor"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sale Value */}
              <div className="space-y-2">
                <Label htmlFor="saleValue">Valor da Venda (R$) *</Label>
                <Input
                  id="saleValue"
                  type="number"
                  value={saleValue}
                  onChange={(e) => setSaleValue(e.target.value)}
                  className="bg-gray-900 border-gray-800"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Signature Date */}
              <div className="space-y-2">
                <Label>Data de Assinatura *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-gray-900 border-gray-800 hover:bg-gray-800"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {signatureDate ? (
                        format(signatureDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                    <Calendar
                      mode="single"
                      selected={signatureDate}
                      onSelect={setSignatureDate}
                      initialFocus
                      locale={ptBR}
                      className="border-gray-800"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Sale Object */}
            <div className="space-y-2">
              <Label htmlFor="saleObject">Objeto da Venda *</Label>
              <Input
                id="saleObject"
                value={saleObject}
                onChange={(e) => setSaleObject(e.target.value)}
                className="bg-gray-900 border-gray-800"
                placeholder="Descrição do que está sendo vendido"
                required
              />
            </div>

            {/* Signature Location */}
            <div className="space-y-2">
              <Label htmlFor="signatureLocation">Local de Assinatura *</Label>
              <Input
                id="signatureLocation"
                value={signatureLocation}
                onChange={(e) => setSignatureLocation(e.target.value)}
                className="bg-gray-900 border-gray-800"
                placeholder="Cidade/Estado onde o contrato será assinado"
                required
              />
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="bg-gray-900 border-gray-800 min-h-[100px]"
                placeholder="Informações adicionais sobre o contrato"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-amber-500 text-black hover:bg-amber-600"
              disabled={loading}
            >
              {loading ? "Gerando contrato..." : "Gerar Contrato"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}