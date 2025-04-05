"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

export default function NewContract() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link href="/dashboard">
          <Button variant="ghost" className="mr-4 text-gray-400 hover:text-white">
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Contract</h1>
      </div>

      <Tabs defaultValue="simple-sale" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900">
          <TabsTrigger value="simple-sale" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            <FileText className="mr-2 h-4 w-4" />
            Simple Sale Contract
          </TabsTrigger>
          <TabsTrigger
            value="loan"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
            disabled
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Loan Contract (Coming Soon)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="simple-sale">
          <Card className="border-gray-800 bg-gray-950">
            <CardHeader>
              <CardTitle>Simple Sale Contract</CardTitle>
              <CardDescription>Create a contract for a simple sale transaction between two parties</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSaleForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="loan">
          <Card className="border-gray-800 bg-gray-950">
            <CardHeader>
              <CardTitle>Loan Contract</CardTitle>
              <CardDescription>This feature is coming soon in a future update</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-16 w-16 text-gray-600 mb-4" />
                <p className="text-gray-400 text-center">
                  Loan contracts will be available in a future update. Stay tuned!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SimpleSaleForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [sellerNodeId, setSellerNodeId] = useState("")
  const [sellerPublicKey, setSellerPublicKey] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validação básica
    if (!sellerNodeId || !sellerPublicKey || !amount) {
      setError("Please fill in all fields")
      return
    }

    // Verificar se temos os dados do comprador (usuário logado)
    if (!user?.publicKey || !user?.nodeId) {
      setError("User authentication data is missing. Please log in again.")
      return
    }

    setLoading(true)

    try {
      // 1. Gerar o contrato Lightning
      const generateResponse = await fetch('http://localhost:3001/api/generate-lightning-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerPublicKey: user.publicKey,
          buyerNodeId: user.nodeId,
          sellerPublicKey,
          sellerNodeId,
          amount: Number(amount)
        }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || 'Failed to generate contract')
      }

      const { contract } = await generateResponse.json()

      // 2. Fazer deploy do contrato
      const deployResponse = await fetch('http://localhost:3001/api/deploy-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contract }),
      })

      if (!deployResponse.ok) {
        const errorData = await deployResponse.json()
        throw new Error(errorData.error || 'Failed to deploy contract')
      }

      const deployData = await deployResponse.json()

      // 3. Armazenar localmente para referência
      localStorage.setItem(`contract_${contract.id}`, JSON.stringify({
        ...contract,
        paymentRequest: deployData.paymentRequest,
        deployStatus: deployData.deployStatus
      }))

      // 4. Navegar para a página de preview com o ID do contrato
      router.push(`/contracts/preview/${contract.id}`)

    } catch (err) {
      console.error('Contract creation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create contract')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-md">{error}</div>}

      {/* Seção mostrando as informações do comprador (usuário logado) */}
      <div className="space-y-2">
        <Label>Your Information (Buyer)</Label>
        <div className="p-4 bg-gray-900 rounded-md border border-gray-800">
          <p className="text-sm text-gray-300">
            <span className="font-semibold">Public Key:</span> {user?.publicKey || 'Not available'}
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <span className="font-semibold">Node ID:</span> {user?.nodeId || 'Not available'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sellerNodeId">Seller Node ID</Label>
        <Input
          id="sellerNodeId"
          value={sellerNodeId}
          onChange={(e) => setSellerNodeId(e.target.value)}
          className="bg-gray-900 border-gray-800"
          placeholder="Enter the seller's Lightning Network Node ID"
          required
        />
        <p className="text-xs text-gray-400">
          The Lightning Network Node ID of the seller (e.g.,
          03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sellerPublicKey">Seller Public Key</Label>
        <Input
          id="sellerPublicKey"
          value={sellerPublicKey}
          onChange={(e) => setSellerPublicKey(e.target.value)}
          className="bg-gray-900 border-gray-800"
          placeholder="Enter the seller's Bitcoin Public Key"
          required
        />
        <p className="text-xs text-gray-400">
          The Bitcoin Public Key of the seller (e.g.,
          02e5be89fa161bf6b0bc64ec9ec7fe27311fbb0949a06bfcafdbb48a1e715a53c1)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (in satoshis)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-gray-900 border-gray-800"
          placeholder="Enter the amount in satoshis"
          required
          min="1"
        />
        {amount && (
          <p className="text-sm text-gray-400">Approximately {(Number.parseInt(amount) / 100000000).toFixed(8)} BTC</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-amber-600" disabled={loading}>
        {loading ? "Generating Contract..." : "Generate Contract"}
      </Button>
    </form>
  )
}