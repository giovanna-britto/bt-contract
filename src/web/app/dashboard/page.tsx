"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Eye, Sparkles } from "lucide-react"

export default function Dashboard() {
  // Mock data - would normally come from an API
  const contracts = [
    {
      id: "1fc5cf854c4a48b648bd71d5d1720110",
      type: "Simple Sale",
      amount: 500000,
      amountInBTC: "0.00500000",
      date: "2025-04-05",
      status: "Active",
    },
    {
      id: "2ab7de963b5a59c759ce82d6e2831221",
      type: "Simple Sale",
      amount: 1200000,
      amountInBTC: "0.01200000",
      date: "2025-04-03",
      status: "Completed",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/contracts/new">
            <Button className="bg-amber-500 text-black hover:bg-amber-600">
              <Plus className="mr-2 h-4 w-4" /> New Contract
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-800 bg-gray-950">
          <CardHeader>
            <CardTitle>My Contracts</CardTitle>
            <CardDescription>View and manage your existing contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/contracts">
              <Button variant="outline" className="w-full border-amber-500 text-amber-500 hover:bg-amber-500/10">
                <Eye className="mr-2 h-4 w-4" /> View All Contracts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-950">
          <CardHeader>
            <CardTitle>Create New Contract</CardTitle>
            <CardDescription>Set up a new Bitcoin smart contract</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/contracts/new">
              <Button variant="outline" className="w-full border-amber-500 text-amber-500 hover:bg-amber-500/10 mb-4">
                <Plus className="mr-2 h-4 w-4" /> Create Manually
              </Button>
            </Link>
            <Link href="/ai">
              <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-500/10">
                <Sparkles className="mr-2 h-4 w-4" /> Create with AI Agent
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-950">
          <CardHeader>
            <CardTitle>AI Contract Templates</CardTitle>
            <CardDescription>Pre-built templates for common scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/contracts/templates">
              <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-500/10">
                <Sparkles className="mr-2 h-4 w-4" /> Browse Templates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-800 bg-gray-950">
        <CardHeader>
          <CardTitle>Recent Contracts</CardTitle>
          <CardDescription>Your most recent contract activities</CardDescription>
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
                <div className="text-right">
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
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/contracts" className="w-full">
            <Button variant="outline" className="w-full border-gray-800 hover:border-amber-500 hover:text-amber-500">
              View All Contracts
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}