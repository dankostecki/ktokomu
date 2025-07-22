import { useState, useEffect } from 'react'
import { Plus, Minus, ArrowRight, List, Settings, Home, X, Percent } from 'lucide-react'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"
import { Slider } from "./components/ui/slider"

type TransactionType = 'loan' | 'purchase' | 'joint'
type Person = 'user1' | 'user2'
type SplitMethod = 'percentage' | 'amount'

interface Transaction {
  id: string
  type: TransactionType
  date: string
  amount: number
  description: string
  payer: Person
  beneficiary: Person
  splitAmount?: number
  splitPercentage?: number
}

function FinanceSplitter() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)
  const [activeTab, setActiveTab] = useState<'add' | 'history' | 'home'>('home')
  const [user1Name, setUser1Name] = useState('User 1')
  const [user2Name, setUser2Name] = useState('User 2')
  const [showSettings, setShowSettings] = useState(false)

  const [type, setType] = useState<TransactionType>('loan')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [payer, setPayer] = useState<Person>('user1')
  const [beneficiary, setBeneficiary] = useState<Person>('user2')
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('percentage')
  const [splitPercentage, setSplitPercentage] = useState(50)
  const [splitAmount, setSplitAmount] = useState('')

  useEffect(() => {
    if (type === 'joint' && splitMethod === 'percentage' && amount) {
      const total = parseFloat(amount)
      const amountForPayer = total * (splitPercentage / 100)
      setSplitAmount(amountForPayer.toFixed(2))
    }
  }, [splitPercentage, amount, type, splitMethod])

  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-splitter-transactions')
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions))

    const savedUser1Name = localStorage.getItem('finance-splitter-user1')
    if (savedUser1Name) setUser1Name(savedUser1Name)

    const savedUser2Name = localStorage.getItem('finance-splitter-user2')
    if (savedUser2Name) setUser2Name(savedUser2Name)
  }, [])

  useEffect(() => {
    calculateBalance()
  }, [transactions, user1Name, user2Name])

  const calculateBalance = () => {
    let total = 0
    transactions.forEach(transaction => {
      if (transaction.type === 'loan' || transaction.type === 'purchase') {
        if (transaction.payer === 'user1') {
          total -= transaction.amount
        } else {
          total += transaction.amount
        }
      } else if (transaction.type === 'joint') {
        const payerAmount = transaction.splitAmount !== undefined 
          ? transaction.splitAmount 
          : transaction.amount * ((transaction.splitPercentage || 50) / 100)
        
        if (transaction.payer === 'user1') {
          total -= payerAmount
        } else {
          total += payerAmount
        }
      }
    })
    setBalance(total)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Finance Splitter</CardTitle>
            <CardDescription>
              Track shared expenses between {user1Name} and {user2Name}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {balance === 0 ? (
              <p className="text-center text-lg">All expenses are settled</p>
            ) : balance < 0 ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">{user2Name} owes {user1Name}</span>
                <span className="text-xl font-bold text-red-600">${Math.abs(balance).toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">{user1Name} owes {user2Name}</span>
                <span className="text-xl font-bold text-green-600">${balance.toFixed(2)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FinanceSplitter
