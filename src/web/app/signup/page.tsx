"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bitcoin } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [nodeId, setNodeId] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const { signup, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    setPasswordError("");
    
    try {
      await signup(email, password, name, publicKey, nodeId);
    } catch (err) {
      console.error("Signup failed", err);
      // O erro já é manipulado no contexto
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md border-gray-800 bg-gray-950">
        <CardHeader className="space-y-1 items-center text-center">
          <Bitcoin className="h-12 w-12 text-amber-500 mb-2" />
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-900 border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicKey">Public Key</Label>
              <Input
                id="publicKey"
                type="text"
                placeholder="Enter your public key"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                required
                className="bg-gray-900 border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nodeId">Node ID</Label>
              <Input
                id="nodeId"
                type="text"
                placeholder="Enter your node ID"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                required
                className="bg-gray-900 border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-900 border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-900 border-gray-800"
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full bg-amber-500 text-black hover:bg-amber-600"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-amber-500 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}