'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { checkLogin } from '@/utils/login'

type Phase = 'first' | 'operator' | 'second'
type Operator = '+' | '-' | '*' | '/'

const STUDENT = '68053590 กุลธิดา กำเหนิด'

// คำนวณ (คืน null เมื่อหารด้วยศูนย์)
const calculate = (first: number, second: number, op: Operator): number | null => {
  switch (op) {
    case '+': return first + second
    case '-': return first - second
    case '*': return first * second
    case '/': return second === 0 ? null : first / second
  }
}

// กันเลขทศนิยมเพี้ยน เช่น 0.1 + 0.2
const toDisplay = (n: number) => String(parseFloat(n.toPrecision(12)))

// ใส่ช่องว่างแบ่งหลักพัน (เฉพาะส่วนจำนวนเต็ม) เช่น 1234567 -> "1 234 567"
const groupDigits = (str: string, separator = ' ', groupSize = 3) => {
  const match = str.match(/^(-?)(\d+)(\.\d*)?$/)
  if (!match) return str // เช่น "Error"
  const [, sign, int, frac = ''] = match
  let grouped = ''
  for (let i = 0; i < int.length; i++) {
    const fromRight = int.length - i
    grouped += int[i]
    if (fromRight > 1 && (fromRight - 1) % groupSize === 0) grouped += separator
  }
  return sign + grouped + frac
}

const colors = {
  green: 'bg-[rgb(213,236,178)]',
  red: 'bg-red-600',
  purple: 'bg-[rgb(244,236,255)]',
}

export default function Page() {
  const router = useRouter()
  useEffect(() => checkLogin(router, '/calculator'), [router])

  const [phase, setPhase] = useState<Phase>('first')
  const [display, setDisplay] = useState('0')
  const [first, setFirst] = useState(0)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [overwrite, setOverwrite] = useState(false) // หลังกด = ให้พิมพ์เลขใหม่ทับผลลัพธ์

  const reset = (message = '0') => {
    setPhase('first')
    setDisplay(message)
    setFirst(0)
    setOperator(null)
    setOverwrite(message === 'Error')
  }

  // เมื่อกดตัวเลข
  const numberClick = (num: number) => {
    if (phase === 'first') {
      const replace = display === '0' || display === 'Error' || overwrite
      setDisplay(replace ? String(num) : display + num)
      setOverwrite(false)
    } else if (phase === 'operator') {
      // เริ่มรับเลขตัวที่ 2
      setDisplay(String(num))
      setPhase('second')
    } else {
      setDisplay(display + num)
    }
  }

  // เมื่อกด + - × ÷
  const operatorClick = (op: Operator) => {
    if (display === 'Error') return

    if (phase === 'first') {
      setFirst(Number(display))
      setOperator(op)
      setPhase('operator')
    } else if (phase === 'operator') {
      // กด operator ซ้ำ ให้เปลี่ยน operator
      setOperator(op)
    } else if (operator) {
      const result = calculate(first, Number(display), operator)
      if (result === null) return reset('Error')
      setDisplay(toDisplay(result))
      setFirst(result)
      setOperator(op)
      setPhase('operator')
    }
  }

  // เมื่อกด =
  const equalClick = () => {
    if (phase !== 'second' || !operator) return
    const result = calculate(first, Number(display), operator)
    if (result === null) return reset('Error')

    setDisplay(toDisplay(result))
    setFirst(result)
    setOperator(null)
    setPhase('first')
    setOverwrite(true)
  }

  // CE
  const ceClick = () => reset()

  // keyboard (ผูกใหม่ทุกครั้งที่ state เปลี่ยน เพื่อให้ได้ค่าล่าสุดเสมอ)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9' && e.key.length === 1) numberClick(Number(e.key))
      else if (e.key === '+' || e.key === '-' || e.key === '*') operatorClick(e.key)
      else if (e.key === '/') {
        e.preventDefault()
        operatorClick('/')
      } else if (e.key === 'Enter') {
        e.preventDefault()
        equalClick()
      } else if (e.key === 'Escape') ceClick()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  // ปุ่ม: ไม่ส่ง onClick = ปุ่มที่ปิดไว้ (disabled)
  const btn = (label: string, color: keyof typeof colors, onClick?: () => void) => (
    <button
      key={label}
      onClick={onClick}
      disabled={!onClick}
      className={`${colors[color]} h-10 w-[45px] cursor-pointer rounded-[10px] border-2 border-[#767676] text-base font-bold text-black active:scale-95 disabled:cursor-default disabled:active:scale-100`}
    >
      {label}
    </button>
  )

  const row = (children: ReactNode) => <div className="mt-[5px] flex gap-1">{children}</div>

  return (
    <div className="grid min-h-[390px] place-items-center py-8">
      <div className="rounded-t-[18px] border-[3px] border-black bg-gray-500">
        <div className="rounded-[15px] border-[5px] border-gray-500 bg-gradient-to-br from-white to-gray-500 p-[5px]">
          {/* screen */}
          <div className="mb-[25px] flex h-10 items-center justify-end overflow-hidden rounded-[10px] border border-gray-500 bg-[rgb(228,248,253)] px-2 pb-1 text-[1.75rem] text-black">
            {groupDigits(display)}
          </div>

          {row(<>
            {btn('MC', 'green')}
            {btn('MR', 'green')}
            {btn('M+', 'green')}
            {btn('M-', 'green')}
            {btn('CE', 'red', ceClick)}
          </>)}

          {row(<>
            {btn('7', 'purple', () => numberClick(7))}
            {btn('8', 'purple', () => numberClick(8))}
            {btn('9', 'purple', () => numberClick(9))}
            {btn('÷', 'green', () => operatorClick('/'))}
            {btn('√', 'green')}
          </>)}

          {row(<>
            {btn('4', 'purple', () => numberClick(4))}
            {btn('5', 'purple', () => numberClick(5))}
            {btn('6', 'purple', () => numberClick(6))}
            {btn('×', 'green', () => operatorClick('*'))}
            {btn('%', 'green')}
          </>)}

          {row(<>
            {btn('1', 'purple', () => numberClick(1))}
            {btn('2', 'purple', () => numberClick(2))}
            {btn('3', 'purple', () => numberClick(3))}
            {btn('−', 'green', () => operatorClick('-'))}
            {btn('1/x', 'green')}
          </>)}

          {row(<>
            {btn('0', 'purple', () => numberClick(0))}
            {btn('.', 'purple')}
            {btn('±', 'purple')}
            {btn('+', 'green', () => operatorClick('+'))}
            {btn('=', 'green', equalClick)}
          </>)}
        </div>

        <div className="p-1 text-center font-mono text-base text-[rgb(247,247,247)]">
          {STUDENT}
        </div>
      </div>
    </div>
  )
}