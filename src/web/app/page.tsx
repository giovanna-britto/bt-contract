import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Coins } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-20 text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          Bitcoin Smart Contract Platform
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          Generate, deploy, and manage Bitcoin smart contracts with ease. The ultimate platform for your blockchain
          innovations.
        </p>
        <Link href="/signup">
          <Button className="bg-amber-500 text-black hover:bg-amber-600 px-8 py-6 text-lg">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mt-10">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <Shield className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
          <p className="text-gray-400">
            Leverage the security of Bitcoin's blockchain for your contracts with our HTLC implementation.
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <Zap className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
          <p className="text-gray-400">
            Deploy contracts in seconds with our Lightning Network integration for instant settlements.
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <Coins className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Asset Transfers</h3>
          <p className="text-gray-400">Simplify real-world asset transfers with our easy-to-use contract templates.</p>
        </div>
      </div>
    </div>
  )
}

