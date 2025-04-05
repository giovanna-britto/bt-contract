"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus } from "lucide-react"

export default function Contracts() {
  // Mock data - would normally come from an API
  const contracts = [
    {
      id: "1fc5cf854c4a48b648bd71d5d1720110",
      type: "Simple Sale",
      amount: 500000,
      amountInBTC: "0.00500000",
      date: "2025-04-05",
      status: "Active",
      parties: {
        buyer: { nodeId: "02eadbd9e7557375161df8b646776a547c5097614f97cae435257dc8b63f0a0f82" },
        seller: { nodeId: "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f" },
      },
    },
    {
      id: "2ab7de963b5a59c759ce82d6e2831221",
      type: "Simple Sale",
      amount: 1200000,
      amountInBTC: "0.01200000",
      date: "2025-04-03",
      status: "Completed",
      parties: {
        buyer: { nodeId: "02eadbd9e7557375161df8b646776a547c5097614f97cae435257dc8b63f0a0f82" },
        seller: { nodeId: "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f" },
      },
    },
    {
      id: "3cd8ef074c6b6ad86adf93e7f3942332",
      type: "Simple Sale",
      amount: 750000,
      amountInBTC: "0.00750000",
      date: "2025-04-01",
      status: "Completed",
      parties: {
        buyer: { nodeId: "02eadbd9e7557375161df8b646776a547c5097614f97cae435257dc8b63f0a0f82" },
        seller: { nodeId: "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f" },
      },
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Contracts</h1>
        <Link href="/contracts/new">
          <Button className="bg-amber-500 text-black hover:bg-amber-600">
            <Plus className="mr-2 h-4 w-4" /> New Contract
          </Button>
        </Link>
      </div>

      <Card className="border-gray-800 bg-gray-950">
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
          <CardDescription>View and manage all your Bitcoin smart contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between p-4 border border-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-amber-500" />
                  <div>
                    <p className="font-medium">{contract.type}</p>
                    <p className="text-sm text-gray-400">ID: {contract.id.substring(0, 8)}...</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">{contract.amountInBTC} BTC</p>
                  <p className="text-sm text-gray-400">{contract.date}</p>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      contract.status === "Active" ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>
                <Link href={`/contracts/${contract.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

