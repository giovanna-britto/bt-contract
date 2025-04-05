"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"

export default function ContractPreview({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deployResponse, setDeployResponse] = useState<any>(null)
  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recuperar os dados do contrato do localStorage (simulando um backend)
    const contractData = localStorage.getItem(`contract_${params.id}`)

    if (contractData) {
      try {
        const parsedData = JSON.parse(contractData)

        // Criar um objeto de contrato com os dados do formulário
        const contractObj = {
          success: true,
          contract: {
            version: "1.0",
            type: "Lightning Network Contract",
            id: params.id,
            parties: {
              buyer: {
                publicKey: "03a23d6b59ab80f6a2cd6a00af02a6772e37b0d450f64ebe31ec1126f3f9ec7709",
                nodeId: "02eadbd9e7557375161df8b646776a547c5097614f97cae435257dc8b63f0a0f82",
              },
              seller: {
                publicKey: parsedData.sellerPublicKey,
                nodeId: parsedData.sellerNodeId,
              },
            },
            transaction: {
              amount: parsedData.amount,
              amountInBTC: (parsedData.amount / 100000000).toFixed(8),
            },
            contract: {
              type: "HTLC",
              paymentHash: "4097a4168087496a046bfdd0c3f7e28eec13cf53e558ad770e96bb5296f538d7",
              expirationBlocks: 144,
              description: "Lightning Network contract for automatic transfer from buyer to seller using HTLC.",
            },
            invoiceDetails: {
              description: `Payment for contract #${params.id}`,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas a partir de agora
              paymentHash: "4097a4168087496a046bfdd0c3f7e28eec13cf53e558ad770e96bb5296f538d7",
              amount: parsedData.amount,
            },
            deploymentInstructions: {
              description: 'When you click "Deploy", the system will:',
              steps: [
                "1. Create a Lightning invoice with the specified hash",
                "2. Share the invoice with the buyer",
                "3. When payment is received, the system will automatically reveal the preimage to the seller",
                "4. Funds will be automatically released to the seller",
              ],
            },
          },
        }

        setContract(contractObj)
      } catch (err) {
        setError("Erro ao carregar os dados do contrato")
      }
    } else {
      setError("Contrato não encontrado")
    }

    setLoading(false)
  }, [params.id])

  const handleDeploy = async () => {
    setDeploying(true)
    setError(null)

    try {
      // Mock API call - would normally call the actual endpoint
      // http://localhost:3000/api/deploy-contract
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful deployment with the response format you specified
      const mockDeployResponse = {
        success: true,
        contractId: params.id,
        paymentRequest:
          "lnbc500000n1p38q70upp5e0ssf7ur55klw4rjn5le9k5c5rwfn7lj8yz9xwzv5d6lgnhwp7kqdpp5qgzn4tpqz25h0eafq8qnrp5gevqyn2v3hnqmegyy5zqmrfva5ksdqqxqyjw5qcqp2rzjqwyx8nu2hygyvgc02cwdtvuxe0lcxz06qt3lpsldzcdr46my5nvqqqqgqqqqqqqlgqqqqqeqqjqrzjqd4jy6444ywdtv2mqqa2pel3r7wsnjqphlx5qmvsf9jjfkla93ozlkc44qdqqvqqqqqqqqlgqqqqjqdqvvh9g5q4097a4168087496a046bfdd0c3f7e28eec13cf53e558ad770e96bb5296f538d7",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        amount: contract?.contract?.transaction?.amount || 0,
        deployStatus: "deployed",
      }

      setDeployResponse(mockDeployResponse)
      setDeployed(true)

      // After a delay, redirect to the contract details page
      setTimeout(() => {
        router.push(`/contracts/${params.id}`)
      }, 2000)
    } catch (err) {
      setError("There was an error deploying your contract. Please try again.")
    } finally {
      setDeploying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-amber-500">Carregando detalhes do contrato...</div>
      </div>
    )
  }

  if (error && !contract) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Link href="/contracts/new">
            <Button variant="ghost" className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Contract Preview</h1>
        </div>

        <Alert className="bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Link href="/contracts/new">
          <Button className="bg-amber-500 text-black hover:bg-amber-600">Return to Contract Creation</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link href="/contracts/new">
          <Button variant="ghost" className="mr-4 text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Contract Preview</h1>
      </div>

      {deployed && (
        <Alert className="bg-green-900 border-green-700">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your contract has been successfully deployed. Redirecting to payment page...
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {contract && (
        <Card className="border-gray-800 bg-gray-950">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>Review your contract details before deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-900 p-4 rounded-md border border-gray-800">
                <h3 className="text-lg font-medium mb-2">Contract Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Contract ID</p>
                    <p className="font-mono">{contract.contract.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contract Type</p>
                    <p>{contract.contract.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p>
                      {contract.contract.transaction.amountInBTC} BTC ({contract.contract.transaction.amount} sats)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contract Mechanism</p>
                    <p>{contract.contract.contract.type}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-md border border-gray-800">
                <h3 className="text-lg font-medium mb-2">Parties</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Buyer Node ID</p>
                    <p className="font-mono text-sm break-all">{contract.contract.parties.buyer.nodeId}</p>
                    <p className="text-sm text-gray-400 mt-2">Buyer Public Key</p>
                    <p className="font-mono text-sm break-all">{contract.contract.parties.buyer.publicKey}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Seller Node ID</p>
                    <p className="font-mono text-sm break-all">{contract.contract.parties.seller.nodeId}</p>
                    <p className="text-sm text-gray-400 mt-2">Seller Public Key</p>
                    <p className="font-mono text-sm break-all">{contract.contract.parties.seller.publicKey}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-md border border-gray-800">
                <h3 className="text-lg font-medium mb-2">Deployment Process</h3>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  {contract.contract.deploymentInstructions.steps.map((step: string, index: number) => (
                    <li key={index} className="text-gray-300">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={handleDeploy}
              className="w-full bg-amber-500 text-black hover:bg-amber-600"
              disabled={deploying || deployed}
            >
              {deploying ? "Deploying Contract..." : "Deploy Contract"}
            </Button>
            <Link href="/contracts/new" className="w-full">
              <Button variant="outline" className="w-full border-gray-800 hover:border-amber-500 hover:text-amber-500">
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

