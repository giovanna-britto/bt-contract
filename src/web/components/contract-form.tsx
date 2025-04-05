"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function ContractForm() {
  const router = useRouter()
  const [sellerNodeId, setSellerNodeId] = useState("")
  const [sellerPublicKey, setSellerPublicKey] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // This would be an actual API call to http://localhost:3000/api/generate-lightning-contract
    // For now, we'll just simulate the delay and redirect
    setTimeout(() => {
      router.push("/contracts/preview/1fc5cf854c4a48b648bd71d5d1720110")
    }, 1000)
  }

  return (
    <Card className="w-full border-gray-800 bg-gray-950">
      <CardHeader>
        <CardTitle>Create Lightning Network Contract</CardTitle>
        <CardDescription>Enter the seller details and amount to generate a smart contract</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
            <p className="text-xs text-gray-400">The Lightning Network Node ID of the seller</p>
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
            <p className="text-xs text-gray-400">The Bitcoin Public Key of the seller</p>
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
            />
            {amount && (
              <p className="text-sm text-gray-400">
                Approximately {(Number.parseInt(amount) / 100000000).toFixed(8)} BTC
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-amber-600" disabled={loading}>
            {loading ? "Generating Contract..." : "Generate Contract"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

