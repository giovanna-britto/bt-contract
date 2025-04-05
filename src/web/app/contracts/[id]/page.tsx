"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, FileText, ExternalLink, Copy, AlertCircle } from "lucide-react"
import QRCode from "@/components/qr-code"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContractDetails({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
            status: "pending_payment", // pending_payment, paid, settled, expired
            deployedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            transactionId: "7a6c52b6f8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5",
            contractAddress: "bc1q9h6mqkfusd8v7r3f2q3z5r4t5v6w7x8y9z0a1b2c3d4e5f6g7h8j9k0l",
            paymentRequest:
              "lnbc500000n1p38q70upp5e0ssf7ur55klw4rjn5le9k5c5rwfn7lj8yz9xwzv5d6lgnhwp7kqdpp5qgzn4tpqz25h0eafq8qnrp5gevqyn2v3hnqmegyy5zqmrfva5ksdqqxqyjw5qcqp2rzjqwyx8nu2hygyvgc02cwdtvuxe0lcxz06qt3lpsldzcdr46my5nvqqqqgqqqqqqqlgqqqqqeqqjqrzjqd4jy6444ywdtv2mqqa2pel3r7wsnjqphlx5qmvsf9jjfkla93ozlkc44qdqqvqqqqqqqqlgqqqqjqdqvvh9g5q4097a4168087496a046bfdd0c3f7e28eec13cf53e558ad770e96bb5296f538d7",
          },
        }

        setContract(contractObj.contract)
      } catch (err) {
        setError("Erro ao carregar os dados do contrato")
      }
    } else {
      // Fallback para o contrato mockado original se não encontrar no localStorage
      // Isso é útil para manter a compatibilidade com os IDs de contrato existentes
      const mockContract = {
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
              publicKey: "02e5be89fa161bf6b0bc64ec9ec7fe27311fbb0949a06bfcafdbb48a1e715a53c1",
              nodeId: "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
            },
          },
          transaction: {
            amount: 500000,
            amountInBTC: "0.00500000",
          },
          contract: {
            type: "HTLC",
            paymentHash: "4097a4168087496a046bfdd0c3f7e28eec13cf53e558ad770e96bb5296f538d7",
            expirationBlocks: 144,
            description: "Lightning Network contract for automatic transfer from buyer to seller using HTLC.",
          },
          status: "pending_payment", // pending_payment, paid, settled, expired
          deployedAt: "2025-04-05T08:38:25.056Z",
          expiresAt: "2025-04-06T11:51:04.398Z",
          transactionId: "7a6c52b6f8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5",
          contractAddress: "bc1q9h6mqkfusd8v7r3f2q3z5r4t5v6w7x8y9z0a1b2c3d4e5f6g7h8j9k0l",
          paymentRequest:
            "lnbc500000n1p38q70upp5e0ssf7ur55klw4rjn5le9k5c5rwfn7lj8yz9xwzv5d6lgnhwp7kqdpp5qgzn4tpqz25h0eafq8qnrp5gevqyn2v3hnqmegyy5zqmrfva5ksdqqxqyjw5qcqp2rzjqwyx8nu2hygyvgc02cwdtvuxe0lcxz06qt3lpsldzcdr46my5nvqqqqgqqqqqqqlgqqqqqeqqjqrzjqd4jy6444ywdtv2mqqa2pel3r7wsnjqphlx5qmvsf9jjfkla93ozlkc44qdqqvqqqqqqqqlgqqqqjqdqvvh9g5q4097a4168087496a046bfdd0c3f7e28eec13cf53e558ad770e96bb5296f538d7",
        },
      }
      setContract(mockContract.contract)
    }

    setLoading(false)
  }, [params.id])

  // Calculate time left until expiration
  useEffect(() => {
    if (contract && contract.status === "pending_payment") {
      const updateTimeLeft = () => {
        const now = new Date()
        const expiresAt = new Date(contract.expiresAt)
        const diff = expiresAt.getTime() - now.getTime()

        if (diff <= 0) {
          setTimeLeft("Expired")
          return
        }

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      }

      updateTimeLeft()
      const interval = setInterval(updateTimeLeft, 1000)
      return () => clearInterval(interval)
    }
  }, [contract])

  const copyToClipboard = () => {
    if (contract) {
      navigator.clipboard.writeText(contract.paymentRequest)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusBadge = () => {
    if (!contract) return null

    switch (contract.status) {
      case "pending_payment":
        return (
          <Badge className="bg-yellow-900 text-yellow-300 px-3 py-1 text-sm">
            <AlertCircle className="mr-1 h-3 w-3" /> Awaiting Payment
          </Badge>
        )
      case "paid":
        return (
          <Badge className="bg-blue-900 text-blue-300 px-3 py-1 text-sm">
            <CheckCircle className="mr-1 h-3 w-3" /> Paid
          </Badge>
        )
      case "settled":
        return (
          <Badge className="bg-green-900 text-green-300 px-3 py-1 text-sm">
            <CheckCircle className="mr-1 h-3 w-3" /> Settled
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-900 text-red-300 px-3 py-1 text-sm">
            <AlertCircle className="mr-1 h-3 w-3" /> Expired
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-900 text-gray-300 px-3 py-1 text-sm">
            <AlertCircle className="mr-1 h-3 w-3" /> Unknown
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-amber-500">Loading contract details...</div>
      </div>
    )
  }

  if (error || !contract) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Link href="/contracts">
            <Button variant="ghost" className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contracts
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Contract Details</h1>
        </div>

        <Alert className="bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Contract not found"}</AlertDescription>
        </Alert>

        <Link href="/contracts">
          <Button className="bg-amber-500 text-black hover:bg-amber-600">Return to Contracts</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/contracts">
            <Button variant="ghost" className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contracts
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Contract Details</h1>
        </div>
        {getStatusBadge()}
      </div>

      {contract.status === "pending_payment" && (
        <Card className="border-gray-800 bg-gray-950">
          <CardHeader>
            <CardTitle>Payment Required</CardTitle>
            <CardDescription>
              Scan the QR code with your Lightning wallet to pay and activate the contract
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="bg-white p-4 rounded-lg">
              <QRCode value={contract.paymentRequest} size={250} />
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">Amount</p>
                <p className="font-medium">
                  {contract.transaction.amountInBTC} BTC ({contract.transaction.amount} sats)
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">Expires in</p>
                <p className="font-medium text-yellow-500">{timeLeft}</p>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm text-gray-400 mb-2">Lightning Payment Request</p>
              <div className="flex items-center">
                <div className="bg-gray-900 p-2 rounded-l-md border border-gray-800 flex-grow overflow-hidden">
                  <p className="font-mono text-xs truncate">{contract.paymentRequest}</p>
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="rounded-l-none border border-l-0 border-gray-800 h-[42px]"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-800 bg-gray-950 md:col-span-2">
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
            <CardDescription>Details about this Bitcoin smart contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Contract ID</p>
                <p className="font-mono">{contract.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Contract Type</p>
                <p>{contract.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Amount</p>
                <p>
                  {contract.transaction.amountInBTC} BTC ({contract.transaction.amount} sats)
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Contract Mechanism</p>
                <p>{contract.contract.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Deployed At</p>
                <p>{new Date(contract.deployedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Expiration</p>
                <p>{contract.contract.expirationBlocks} blocks</p>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-md border border-gray-800">
              <h3 className="text-lg font-medium mb-2">Blockchain Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Contract Address</p>
                  <div className="flex items-center">
                    <p className="font-mono text-sm break-all mr-2">{contract.contractAddress}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-amber-500">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Transaction ID</p>
                  <div className="flex items-center">
                    <p className="font-mono text-sm break-all mr-2">{contract.transactionId}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-amber-500">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Payment Hash</p>
                  <p className="font-mono text-sm break-all">{contract.contract.paymentHash}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-800 bg-gray-950">
            <CardHeader>
              <CardTitle>Parties</CardTitle>
              <CardDescription>Contract participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Buyer</p>
                <p className="text-xs text-gray-400 mt-1">Node ID</p>
                <p className="font-mono text-xs break-all">{contract.parties.buyer.nodeId}</p>
                <p className="text-xs text-gray-400 mt-1">Public Key</p>
                <p className="font-mono text-xs break-all">{contract.parties.buyer.publicKey}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Seller</p>
                <p className="text-xs text-gray-400 mt-1">Node ID</p>
                <p className="font-mono text-xs break-all">{contract.parties.seller.nodeId}</p>
                <p className="text-xs text-gray-400 mt-1">Public Key</p>
                <p className="font-mono text-xs break-all">{contract.parties.seller.publicKey}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-950">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Available contract actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
            <a href="https://gateway.pinata.cloud/ipfs/QmTcKpRUFYptEvvooWkXbD3QjRY3a8K4pnFNrod8sNDbAY" download>
                <Button className="w-full bg-amber-500 text-black hover:bg-amber-600">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Contract
                </Button>
            </a>
                <Button variant="outline" className="w-full border-amber-500 text-amber-500 hover:bg-amber-500/10">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

