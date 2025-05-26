"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  CalendarIcon,
  Github,
  Linkedin,
  Mail,
  Menu,
  Terminal,
  Download,
  Folder,
  FileText,
  Settings,
  X,
  Minimize2,
  Maximize2,
  Calculator,
  ImageIcon,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react"

type AppState = "boot-logs" | "boot-screen" | "terminal" | "gui" | "opening-social" | "cnos-xp"

interface WindowState {
  id: string
  title: string
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

const bootLogs = [
  "Linux qgggart interface v0.105",
  "ACPI: Battery Slot [BAT0] (battery present)",
  "intel_pstate: Intel P-state driver initializing",
  "intel_pstate: HWP enabled",
  "NET: Registered protocol family 10",
  "Segment Routing with IPv6",
  "NET: Registered protocol family 17",
  "microcode: sig=0x906d1, pf=0x32, revision=0x112",
  "microcode: Microcode Update Driver: v2.2.",
  "IPV shorthand broadcast: enabled",
  "sched_clock: Marking stable (880000000, 0)->(880000000, 0)",
  "registered taskstats version 1",
  "Loading compiled-in X.509 certificates",
  "Loaded X.509 cert 'CNOS Secure Boot Signing Key: 123456789abcdef'",
  "zswap: loaded using pool lzo/zbud",
  "AppArmor: AppArmor sha1 policy hashing enabled",
  "AppArmor: AppArmor filesystem Enabled",
  "CNOS: Secure Boot enabled",
  "CNOS: Integrity Measurement enabled",
  "CNOS: Trusted execution enabled",
  "CNOS: Encrypted memory enabled",
  "CNOS: Quantum-resistant cryptography enabled",
  "CNOS: Advanced threat protection enabled",
  "CNOS: Zero trust architecture initialized",
  "CNOS: Secure enclave initialized",
]

const cnosAscii = `
 ██████╗███╗   ██╗ ██████╗ ███████╗
██╔════╝████╗  ██║██╔═══██╗██╔════╝
██║     ██╔██╗ ██║██║   ██║███████╗
██║     ██║╚██╗██║██║   ██║╚════██║
╚██████╗██║ ╚████║╚██████╔╝███████║
 ╚═════╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
`

const socialLinks = {
  linkedin: "https://www.linkedin.com/in/chris-nikhil-6883ba290/",
  github: "https://github.com/chrsnikhil",
  instagram: "https://instagram.com/chrsnikhil",
  duolingo: "https://www.duolingo.com/profile/Nikhil404588",
}

const commands = {
  help: `Available commands:
  help      - Show this help message
  about     - Display information about John Doe
  education - Show educational background
  jobs      - Display work experience
  projects  - List available projects
  skills    - Show technical skills
  contact   - Display contact information
  resume    - Download resume (PDF)
  cnos      - Launch CNOS XP interface
  linkedin  - Open LinkedIn profile
  github    - Open GitHub profile
  instagram - Open Instagram profile
  duolingo  - Open Duolingo profile
  gui       - Launch graphical interface
  clear     - Clear terminal
  exit      - Return to boot screen`,

  about: `Chris Nikhil - Full Stack Developer & Blockchain Developer

I'm a passionate developer with expertise in full-stack development, AI, and 
blockchain technologies. With over 2 years of experience building cutting-edge 
applications, I specialize in creating intuitive and performant user experiences.

My approach combines technical excellence with creative problem-solving, allowing 
me to deliver solutions that not only meet but exceed expectations.`,

  education: `Educational Background:

🎓 Bachelor of Engineering in Computer Science
   LICET- Loyola ICAM College of Engineering and technology (2023-2027)
   • GPA: 8.4

🎓 Higher Secondary Education  
   
   • XAN Matriculation
   • Score:91%
   

`,

  jobs: `Work Experience:

💼 Public Relations Officer
    Served as the Public Relations Officer for the college's technical club, EICON from 2023-2025.
    Contributed to events like FRUITION 2025 and EXPLORE 2k24
    Helped design a maze challenge in GameBoyAdvance for the event EXPLORE 2k24
    
    
   `,

  projects: `Current Projects:

1. Knightingale
   - A PVP game built on Godot Engine powered by the SUI Blockchain
   - Technologies: NEXTJS, Godot, SUI, Web Assembly
   - Status: Production

2. AI Data Analyst
   - Real-time Data Analysis Platform for Excel Files
   - Technologies: Next.js, OpenAi, Python
   - Status: Production

3. Talign
   - Ephemeral Chat Application
   - Technologies: Python, Websockets
   - Status: Production`,

  skills: `Technical Skills:

Frontend:
  • React, Next.js, TypeScript
  • Three.js, D3.js, WebGL, 
  • Tailwind CSS, Framer Motion, 

Backend:
  • Node.js, Python, 
  • PostgreSQL,
  • Vercel

AI/ML:
  • TensorFlow, PyTorch, Hugging Face
  • Computer Vision, NLP, Deep Learning
  

Blockchain:
  • Solidity, Web3.js, Ethers.js, Move
  • Smart Contracts, DeFi, NFTs
  • Ethereum, Solana, Sui`,

  contact: `Contact Information:

Email: chrsnikhil@gmail.com
GitHub: github.com/chrsnikhil
LinkedIn: linkedin.com/in/chrisnikhil


Location: Chennai, India
Timezone: IST(GMT+5:30)
Status: Available for new opportunities`,
}

const skillsData = [
  { name: "React", level: 82 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 92 },
  { name: "Python", level: 94 },
  { name: "AI/ML", level: 82 },
  { name: "Blockchain", level: 88 },
]

const projectsData = [
  {
    title: "Knightingale",
    description:
      "A PVP Game built on the godot game engine powered by the SUI BlockChain with a NFT MarketPlace consisting of custom made NFT's",
    technologies: ["Next", "IPFS", "Godot", "SUI"],
    status: "Production",
    image: "🧠",
    link: "https://knightingalesui.netlify.app/"
  },
  {
    title: "AI Data Analyst",
    description: "Real Time Data Analyst for Excel Files with a custom Algorithm for Fetching data from User uploaded excel files",
    technologies: ["Next.js", "OpenAI", "Excel", "Chatbot"],
    status: "Development",
    image: "📊",
    link: "https://github.com/chrsnikhil/AI-Data-Analyst"
  },
  {
    title: "Talign",
    description: "Ephemeral Chatting application for users to chat with other users using websockets to establish end to end connections",
    technologies: ["Python", "WebSockets", "HTML", "CSS"],
    status: "Production",
    image: "🤖",
    link: "https://taligntest.onrender.com/"
  },
  {
    title: "Parkin",
    description: "A Smart Parking automation system built using websockets to allow users to book their parking spots",
    technologies: ["NextJS", "FramerMotion", "WebSockets", "ESP32"],
    status: "Production",
    image: "🔒",
    link: "https://parkin-complete-git-propercode-chrsnikhils-projects.vercel.app/"
  },
  {
    title: "FaceBook Clone ABSL",
    description: "An Attempt on creating a 1 to 1 clone of the modern facebook website as part of a ABSL Activity",
    technologies: ["NextJS", "TypeScript", "TailwindCSS",],
    status: "Prodcution",
    image: "⚛️",
    link: "https://face-book-absl.vercel.app/"
  },
  {
    title: "Portfolio",
    description: "A Clean Professional Portfolio Built using NextJS and Framer Motion to create a pleasing experience and connect employers",
    technologies: ["NextJS", "TailwindCss",],
    status: "Production",
    image: "🌐",
    link: "https://portfolio-nine-rho-78.vercel.app/"
  },
]

const galleryImages = [
  { id: 1, name: "Project Screenshot 1", type: "screenshot", emoji: "🖥️" },
  { id: 2, name: "Neural Network Diagram", type: "diagram", emoji: "🧠" },
  { id: 3, name: "Architecture Design", type: "design", emoji: "🏗️" },
  { id: 4, name: "Code Visualization", type: "code", emoji: "💻" },
  { id: 5, name: "Data Flow Chart", type: "chart", emoji: "📊" },
  { id: 6, name: "UI Mockup", type: "mockup", emoji: "🎨" },
  { id: 7, name: "System Overview", type: "system", emoji: "⚙️" },
  { id: 8, name: "Performance Graph", type: "graph", emoji: "📈" },
]

const musicTracks = [
  { 
    id: 1, 
    title: "Hot Together", 
    artist: "CNOS Audio", 
    duration: "3:45", 
    emoji: "🎵",
    audioSrc: "/music/hottogether.mp3"
  },
  { 
    id: 2, 
    title: "Hot Together (Remix)", 
    artist: "Neural Beats", 
    duration: "4:12", 
    emoji: "🎶",
    audioSrc: "/music/hottogether.mp3"
  },
  { 
    id: 3, 
    title: "Hot Together (Extended)", 
    artist: "Binary Orchestra", 
    duration: "5:23", 
    emoji: "🎼",
    audioSrc: "/music/hottogether.mp3"
  },
  { 
    id: 4, 
    title: "Hot Together (Ambient)", 
    artist: "System Sounds", 
    duration: "3:58", 
    emoji: "🎧",
    audioSrc: "/music/hottogether.mp3"
  },
  { 
    id: 5, 
    title: "Hot Together (Chill)", 
    artist: "Data Stream", 
    duration: "4:35", 
    emoji: "🎤",
    audioSrc: "/music/hottogether.mp3"
  },
  { 
    id: 6, 
    title: "Hot Together (Acoustic)", 
    artist: "Cyber Collective", 
    duration: "3:21", 
    emoji: "🎸",
    audioSrc: "/music/hottogether.mp3"
  },
]

export default function Component() {
  const [appState, setAppState] = useState<AppState>("boot-logs")
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [currentLogText, setCurrentLogText] = useState("")
  const [completedLogs, setCompletedLogs] = useState<string[]>([])
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [currentSocial, setCurrentSocial] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0)
  const [systemTime, setSystemTime] = useState<Date>(new Date())
  const [windows, setWindows] = useState<WindowState[]>([])
  const [nextZIndex, setNextZIndex] = useState(100)
  const [calculatorValue, setCalculatorValue] = useState("0")
  const [calculatorPrevValue, setCalculatorPrevValue] = useState("")
  const [calculatorOperation, setCalculatorOperation] = useState("")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [duration, setDuration] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setSystemTime(new Date())
    }, 1000)
    return () => clearInterval(timeInterval)
  }, [])

  // Boot logs typing effect
  useEffect(() => {
    if (appState === "boot-logs" && currentLogIndex < bootLogs.length) {
      const currentLog = bootLogs[currentLogIndex]
      let charIndex = 0

      const typeInterval = setInterval(
        () => {
          if (charIndex <= currentLog.length) {
            setCurrentLogText(currentLog.slice(0, charIndex))
            charIndex++
          } else {
            clearInterval(typeInterval)
            setCompletedLogs((prev) => [...prev, currentLog])
            setCurrentLogText("")
            setTimeout(() => {
              setCurrentLogIndex((prev) => prev + 1)
            }, 50)
          }
        },
        15 + Math.random() * 10,
      )

      return () => clearInterval(typeInterval)
    } else if (appState === "boot-logs" && currentLogIndex >= bootLogs.length) {
      setTimeout(() => setAppState("boot-screen"), 500)
    }
  }, [appState, currentLogIndex])

  useEffect(() => {
    if (appState === "boot-screen") {
      const timer = setTimeout(() => {
        setAppState("terminal")
        setTerminalHistory(["Welcome to CNOS Terminal", "Type 'help' for available commands.", ""])
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [appState])

  useEffect(() => {
    if (appState === "terminal" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [appState])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  const downloadResume = () => {
    const a = document.createElement("a")
    a.href = "/resume.pdf"
    a.download = "Chris_Nikhil_Resume.pdf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    const newHistory = [...terminalHistory, `$ ${cmd}`]

    // Clear input field immediately
    setCurrentInput("")

    if (trimmedCmd === "clear") {
      setTerminalHistory([""])
      return
    }

    if (trimmedCmd === "gui") {
      setAppState("gui")
      return
    }

    if (trimmedCmd === "cnos") {
      setAppState("cnos-xp")
      setWindows([])
      return
    }

    if (trimmedCmd === "exit") {
      setAppState("boot-screen")
      return
    }

    if (trimmedCmd === "resume") {
      newHistory.push("Downloading resume...", "Resume downloaded successfully!", "")
      setTerminalHistory(newHistory)
      downloadResume()
      return
    }

    if (socialLinks[trimmedCmd as keyof typeof socialLinks]) {
      setCurrentSocial(trimmedCmd)
      setAppState("opening-social")
      setTimeout(() => {
        window.open(socialLinks[trimmedCmd as keyof typeof socialLinks], "_blank")
        setAppState("terminal")
      }, 2000)
      return
    }

    if (commands[trimmedCmd as keyof typeof commands]) {
      newHistory.push(commands[trimmedCmd as keyof typeof commands], "")
    } else if (trimmedCmd === "") {
      newHistory.push("")
    } else {
      newHistory.push(`Command not found: ${cmd}`, "Type 'help' for available commands.", "")
    }

    setTerminalHistory(newHistory)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(currentInput)
    }
  }

  const openWindow = (windowId: string) => {
    const existingWindow = windows.find((w) => w.id === windowId)
    if (existingWindow) {
      setWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex, isMinimized: false } : w)))
      setNextZIndex((prev) => prev + 1)
      return
    }

    const windowSizes: Record<string, { width: number; height: number }> = {
      calculator: { width: 350, height: 500 },
      gallery: { width: 800, height: 600 },
      music: { width: 500, height: 650 },
      notepad: { width: 700, height: 500 },
      portfolio: { width: 600, height: 450 },
      resume: { width: 550, height: 400 },
      terminal: { width: 650, height: 450 },
      settings: { width: 500, height: 450 },
    }

    const newWindow: WindowState = {
      id: windowId,
      title: getWindowTitle(windowId),
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: windowSizes[windowId] || { width: 600, height: 400 },
      zIndex: nextZIndex,
    }

    setWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)
  }

  const closeWindow = (windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId))
  }

  const minimizeWindow = (windowId: string) => {
    setWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w)))
  }

  const maximizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              position: w.isMaximized ? w.position : { x: 0, y: 0 },
              size: w.isMaximized ? w.size : { width: window.innerWidth, height: window.innerHeight - 40 },
            }
          : w,
      ),
    )
  }

  const bringToFront = (windowId: string) => {
    setWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  const getWindowTitle = (windowId: string) => {
    const titles: Record<string, string> = {
      portfolio: "Portfolio - CNOS XP",
      resume: "Resume - CNOS XP",
      terminal: "Terminal - CNOS XP",
      settings: "Settings - CNOS XP",
      calculator: "Calculator - CNOS XP",
      notepad: "Notepad - CNOS XP",
      gallery: "Gallery - CNOS XP",
      music: "Music Player - CNOS XP",
    }
    return titles[windowId] || "Application - CNOS XP"
  }

  const handleCalculatorInput = (value: string) => {
    if (value === "C") {
      setCalculatorValue("0")
      setCalculatorPrevValue("")
      setCalculatorOperation("")
    } else if (value === "=") {
      if (calculatorPrevValue && calculatorOperation) {
        try {
          const prev = Number.parseFloat(calculatorPrevValue)
          const current = Number.parseFloat(calculatorValue)
          let result = 0

          switch (calculatorOperation) {
            case "+":
              result = prev + current
              break
            case "-":
              result = prev - current
              break
            case "×":
              result = prev * current
              break
            case "÷":
              result = current !== 0 ? prev / current : 0
              break
            default:
              result = current
          }

          setCalculatorValue(result.toString())
          setCalculatorPrevValue("")
          setCalculatorOperation("")
        } catch {
          setCalculatorValue("Error")
        }
      }
    } else if (["+", "-", "×", "÷"].includes(value)) {
      setCalculatorPrevValue(calculatorValue)
      setCalculatorOperation(value)
      setCalculatorValue("0")
    } else {
      setCalculatorValue((prev) => (prev === "0" ? value : prev + value))
    }
  }

  // Background lines component
  const BackgroundLines = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="absolute w-full h-px bg-green-400 opacity-5" style={{ top: `${i * 2}%` }} />
      ))}
    </div>
  )

  // Animated Button Component
  const AnimatedButton = ({ children, className, onClick, ...props }: any) => (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(74, 222, 128, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  )

  // CNOS XP Desktop Component
  const CNOSDesktop = () => (
    <div className="min-h-screen bg-black text-green-400 relative" style={{ fontFamily: "Courier New, monospace" }}>
      <BackgroundLines />

      {/* Desktop */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Desktop Icons */}
        <div className="flex-1 p-4 grid grid-cols-8 gap-4 content-start">
          <motion.div
            className="flex flex-col items-center cursor-pointer hover:bg-green-400/10 p-2 rounded"
            onDoubleClick={() => openWindow("portfolio")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Folder className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Portfolio</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center cursor-pointer hover:bg-green-400/10 p-2 rounded"
            onDoubleClick={() => openWindow("resume")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FileText className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Resume</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center cursor-pointer hover:bg-green-400/10 p-2 rounded"
            onDoubleClick={() => openWindow("terminal")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Terminal className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Terminal</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center cursor-pointer hover:bg-green-400/10 p-2 rounded"
            onDoubleClick={() => openWindow("settings")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Settings</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center cursor-pointer hover:bg-green-400/10 p-2 rounded"
            onDoubleClick={() => openWindow("calculator")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Calculator className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Calculator</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center cursor-pointer hover:bg-green-400/10 p-2 rounded"
            onDoubleClick={() => openWindow("notepad")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FileText className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Notepad</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center cursor-pointer hover:bg-green-400/10 p-2 rounded"
            onDoubleClick={() => openWindow("gallery")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ImageIcon className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Gallery</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center cursor-pointer hover:bg-green-400/10 p-2 rounded"
            onDoubleClick={() => openWindow("music")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Music className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Music</span>
          </motion.div>
        </div>

        {/* Windows - FIXED: Removed AnimatePresence and simplified animations */}
        {windows
          .filter((w) => !w.isMinimized)
          .map((window) => (
            <div
              key={window.id}
              className="absolute bg-black/95 border-2 border-green-400 rounded-lg shadow-2xl overflow-hidden"
              style={{
                top: window.position.y,
                left: window.position.x,
                width: window.size.width,
                height: window.size.height,
                zIndex: window.zIndex,
                transform: "scale(1)",
                opacity: 1,
                transition: "all 0.3s ease-out",
              }}
              onClick={() => bringToFront(window.id)}
            >
              {/* Window Title Bar */}
              <div className="bg-green-400/20 border-b border-green-400 p-2 flex justify-between items-center cursor-move">
                <span className="text-green-300 font-bold text-sm">{window.title}</span>
                <div className="flex space-x-1">
                  <AnimatedButton
                    className="w-6 h-6 bg-green-400/20 border border-green-400 rounded flex items-center justify-center text-green-400"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      minimizeWindow(window.id)
                    }}
                  >
                    <Minimize2 className="w-3 h-3" />
                  </AnimatedButton>
                  <AnimatedButton
                    className="w-6 h-6 bg-green-400/20 border border-green-400 rounded flex items-center justify-center text-green-400"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      maximizeWindow(window.id)
                    }}
                  >
                    <Maximize2 className="w-3 h-3" />
                  </AnimatedButton>
                  <AnimatedButton
                    className="w-6 h-6 bg-red-500/20 border border-red-400 rounded flex items-center justify-center text-red-400"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      closeWindow(window.id)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </AnimatedButton>
                </div>
              </div>

              {/* Window Content */}
              <div className="h-full overflow-hidden flex flex-col" style={{ height: "calc(100% - 40px)" }}>
                {window.id === "calculator" && (
                  <div className="p-4 flex flex-col h-full">
                    <div className="bg-black border-2 border-green-400 p-4 text-right text-2xl font-mono mb-4 rounded min-h-[60px] flex items-center justify-end">
                      {calculatorValue}
                    </div>
                    <div className="grid grid-cols-4 gap-2 flex-1">
                      {["C", "÷", "×", "⌫", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "=", "0", "."].map(
                        (btn, i) => (
                          <AnimatedButton
                            key={i}
                            className={`bg-green-400/20 border-2 border-green-400 rounded font-bold text-lg transition-colors flex items-center justify-center ${
                              btn === "=" ? "row-span-2" : ""
                            } ${btn === "0" ? "col-span-2" : ""} ${
                              ["+", "-", "×", "÷", "="].includes(btn) ? "bg-green-400/30" : ""
                            }`}
                            onClick={() => {
                              if (btn === "⌫") {
                                setCalculatorValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
                              } else {
                                handleCalculatorInput(btn)
                              }
                            }}
                          >
                            {btn}
                          </AnimatedButton>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {window.id === "gallery" && (
                  <div className="p-4 h-full flex gap-4">
                    <div className="w-1/3 border-r border-green-400 pr-4">
                      <h3 className="text-green-300 font-bold mb-4">Image Library</h3>
                      <div className="space-y-2 max-h-full overflow-y-auto">
                        {galleryImages.map((img) => (
                          <motion.div
                            key={img.id}
                            className={`p-3 border border-green-400 rounded cursor-pointer transition-colors ${
                              selectedImage === img.id ? "bg-green-400/30" : "bg-green-400/10"
                            }`}
                            onClick={() => setSelectedImage(img.id)}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 222, 128, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{img.emoji}</span>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-bold truncate">{img.name}</div>
                                <div className="text-xs text-green-400/70">{img.type}</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-green-300 font-bold mb-4">Preview</h3>
                      {selectedImage ? (
                        <div className="border-2 border-green-400 rounded p-8 h-4/5 flex items-center justify-center">
                          <div className="text-center">
                            <motion.div
                              className="text-8xl mb-4"
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              {galleryImages.find((img) => img.id === selectedImage)?.emoji}
                            </motion.div>
                            <div className="text-lg font-bold">
                              {galleryImages.find((img) => img.id === selectedImage)?.name}
                            </div>
                            <div className="text-sm text-green-400/70">
                              Type: {galleryImages.find((img) => img.id === selectedImage)?.type}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-green-400 rounded p-8 h-4/5 flex items-center justify-center text-green-400/50">
                          Select an image to preview
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {window.id === "music" && (
                  <div className="p-4 h-full flex flex-col gap-4">
                    <div className="bg-green-400/10 border-2 border-green-400 rounded p-4">
                      <div className="text-center mb-4">
                        <motion.div
                          className="text-4xl mb-2"
                          animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                          transition={{ duration: 1, repeat: isPlaying ? Number.POSITIVE_INFINITY : 0 }}
                        >
                          {musicTracks[currentTrack]?.emoji}
                        </motion.div>
                        <div className="text-lg font-bold">{musicTracks[currentTrack]?.title}</div>
                        <div className="text-sm text-green-400/70">{musicTracks[currentTrack]?.artist}</div>
                        <div className="text-xs text-green-400/50">
                          {formatTime(audioCurrentTime)} / {formatTime(duration)}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-green-400/20 h-1 rounded-full mb-4">
                        <div 
                          className="bg-green-400 h-full rounded-full transition-all duration-100"
                          style={{ width: `${(audioCurrentTime / duration) * 100}%` }}
                        />
                      </div>

                      <div className="flex justify-center items-center space-x-4 mb-4">
                        <AnimatedButton
                          className="bg-green-400/20 border border-green-400 p-2 rounded"
                          onClick={() => setCurrentTrack((prev) => (prev > 0 ? prev - 1 : musicTracks.length - 1))}
                          disabled={isLoading}
                        >
                          <SkipBack className="w-4 h-4" />
                        </AnimatedButton>
                        <AnimatedButton
                          className="bg-green-400/20 border border-green-400 p-3 rounded"
                          onClick={() => setIsPlaying(!isPlaying)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                          ) : isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </AnimatedButton>
                        <AnimatedButton
                          className="bg-green-400/20 border border-green-400 p-2 rounded"
                          onClick={() => setCurrentTrack((prev) => (prev < musicTracks.length - 1 ? prev + 1 : 0))}
                          disabled={isLoading}
                        >
                          <SkipForward className="w-4 h-4" />
                        </AnimatedButton>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(Number.parseInt(e.target.value))}
                          className="flex-1 accent-green-400"
                        />
                        <span className="text-sm">{volume}%</span>
                      </div>
                    </div>
                    <div className="flex-1 border border-green-400 rounded p-3 overflow-hidden">
                      <h3 className="text-green-300 font-bold mb-3">Playlist</h3>
                      <div className="space-y-1 h-full overflow-y-auto">
                        {musicTracks.map((track, index) => (
                          <motion.div
                            key={track.id}
                            className={`p-2 rounded cursor-pointer transition-colors ${
                              currentTrack === index ? "bg-green-400/30" : "bg-green-400/10"
                            } ${isLoading && currentTrack === index ? "opacity-50" : ""}`}
                            onClick={() => !isLoading && setCurrentTrack(index)}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 222, 128, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <span>{track.emoji}</span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-bold truncate">{track.title}</div>
                                  <div className="text-xs text-green-400/70 truncate">{track.artist}</div>
                                </div>
                              </div>
                              <div className="text-xs text-green-400/50 ml-2">{track.duration}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {window.id === "portfolio" && (
                  <div className="p-4 space-y-4 overflow-y-auto h-full">
                    <h2 className="text-green-300 text-lg font-bold">John Doe - Portfolio</h2>
                    <p className="text-sm">Full Stack Developer & AI Specialist</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-green-300 font-bold mb-2">Contact</h3>
                        <div className="space-y-1 text-sm">
                          <div>📧 chrsnikhil@gmail.com</div>
                          <div>🔗 github.com/chrsnikhil</div>
                          <div>💼 linkedin.com/in/chrisnikhil</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-green-300 font-bold mb-2">Skills</h3>
                        <div className="space-y-1 text-sm">
                          <div>• React & TypeScript</div>
                          <div>• Node.js & Python</div>
                          <div>• AI/ML & Blockchain</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-green-300 font-bold mb-2">Recent Projects</h3>
                      <div className="space-y-2 text-sm">
                        <div>🧠 Knightingale</div>
                        <div>📊 Talign</div>
                        <div>🤖 Parkin</div>
                      </div>
                    </div>
                  </div>
                )}

                {window.id === "resume" && (
                  <div className="p-4 space-y-4 overflow-y-auto h-full">
                    <h2 className="text-green-300 text-lg font-bold">Resume</h2>
                    <AnimatedButton
                      className="bg-green-400/20 border border-green-400 px-4 py-2 rounded w-full text-green-400"
                      onClick={downloadResume}
                    >
                      📄 Download Resume
                    </AnimatedButton>
                    <div className="text-sm space-y-3">
                      <div>
                        <strong className="text-green-300">Education:</strong>
                        <div className="ml-2">BE Computer Science - </div>
                        
                      </div>
                      <div>
                        <strong className="text-green-300">Experience:</strong>
                        <div className="ml-2">2 years in Full Stack Development</div>
                        <div className="ml-2">Blockchain Developer</div>
                      </div>
                      <div>
                        <strong className="text-green-300">Key Skills:</strong>
                        <div className="ml-2">React, Node.js, Python, TensorFlow</div>
                        <div className="ml-2">Vercel, Render, Netlify</div>
                      </div>
                    </div>
                  </div>
                )}

                {window.id === "terminal" && (
                  <div className="p-4 space-y-4 overflow-y-auto h-full">
                    <h2 className="text-green-300 text-lg font-bold">CNOS Terminal</h2>
                    <AnimatedButton
                      className="bg-green-400/20 border border-green-400 px-4 py-2 rounded w-full text-green-400"
                      onClick={() => setAppState("terminal")}
                    >
                      🖥️ Open Full Terminal
                    </AnimatedButton>
                    <div className="text-sm space-y-1 bg-black border border-green-400 p-3 rounded">
                      <div>$ Welcome to CNOS Terminal</div>
                      <div>$ Type 'help' for available commands</div>
                      <div>$ Available: about, projects, skills, resume</div>
                      <div>$ Use 'gui' to return to portfolio</div>
                    </div>
                  </div>
                )}

                {window.id === "settings" && (
                  <div className="p-4 space-y-4 h-full overflow-y-auto">
                    <h2 className="text-green-300 text-lg font-bold">CNOS Settings</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between p-2 border border-green-400/30 rounded">
                        <span>🎨 Theme:</span>
                        <span>Cybernetic Green</span>
                      </div>
                      <div className="flex justify-between p-2 border border-green-400/30 rounded">
                        <span>🖥️ Resolution:</span>
                        <span>
                          {typeof globalThis.window !== 'undefined' 
                            ? `${globalThis.window.innerWidth}x${globalThis.window.innerHeight}`
                            : 'Loading...'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between p-2 border border-green-400/30 rounded">
                        <span>⚡ Performance:</span>
                        <span>Optimized</span>
                      </div>
                      <div className="flex justify-between p-2 border border-green-400/30 rounded">
                        <span>🔒 Security:</span>
                        <span>Maximum</span>
                      </div>
                      <div className="flex justify-between p-2 border border-green-400/30 rounded">
                        <span>🕒 System Time:</span>
                        <span>{systemTime.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between p-2 border border-green-400/30 rounded">
                        <span>📅 Date:</span>
                        <span>{systemTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between p-2 border border-green-400/30 rounded">
                        <span>💾 Memory Usage:</span>
                        <span>2.1GB / 8GB</span>
                      </div>
                      <div className="flex justify-between p-2 border border-green-400/30 rounded">
                        <span>🔋 CPU Usage:</span>
                        <span>15%</span>
                      </div>
                    </div>
                  </div>
                )}

                {window.id === "notepad" && (
                  <div className="p-4 h-full flex flex-col overflow-hidden">
                    <h2 className="text-green-300 text-lg font-bold mb-4">Notepad</h2>
                    <textarea
                      className="flex-1 bg-black border-2 border-green-400 p-3 text-green-400 font-mono resize-none rounded focus:outline-none focus:border-green-300 overflow-y-auto"
                      placeholder="Start typing..."
                      defaultValue={`Welcome to CNOS Notepad!

This is a simple text editor built into the CNOS XP operating system.

You can use this to:
- Take notes
- Write code
- Draft documents
- Store temporary text

Features:
✓ Monospace font for code
✓ Green terminal theme
✓ Auto-resize text area
✓ Persistent text (coming soon)
✓ Syntax highlighting (coming soon)
✓ File operations (coming soon)

Current Projects:
1. Neural Network Visualizer
2. Blockchain Analytics Dashboard
3. AI-Powered Code Assistant

TODO:
- Implement file save/load
- Add syntax highlighting
- Create plugin system`}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Taskbar */}
        <div className="bg-green-400/20 border-t-2 border-green-400 p-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <AnimatedButton
              className="bg-green-400/30 border border-green-400 px-4 py-1 rounded font-bold text-green-400"
              onClick={() => setAppState("terminal")}
            >
              Start
            </AnimatedButton>
            {windows.map((window) => (
              <AnimatedButton
                key={window.id}
                className={`border border-green-400 px-3 py-1 rounded text-sm text-green-400 ${
                  window.isMinimized ? "bg-green-400/10" : "bg-green-400/20"
                }`}
                onClick={() => {
                  if (window.isMinimized) {
                    setWindows((prev) =>
                      prev.map((w) => (w.id === window.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w)),
                    )
                    setNextZIndex((prev) => prev + 1)
                  } else {
                    bringToFront(window.id)
                  }
                }}
              >
                {window.id.charAt(0).toUpperCase() + window.id.slice(1)}
              </AnimatedButton>
            ))}
          </div>
          <div className="text-sm">
            {systemTime.toLocaleTimeString()} | {systemTime.toLocaleDateString()} | CNOS XP
          </div>
        </div>
      </div>
    </div>
  )

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audio.preload = "auto"
    setAudioElement(audio)

    // Cleanup
    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Handle audio loading and playback
  useEffect(() => {
    if (!audioElement) return

    const handleTimeUpdate = () => {
      setAudioCurrentTime(audioElement.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration)
      setIsLoading(false)
    }

    const handleEnded = () => {
      setCurrentTrack((prev) => (prev < musicTracks.length - 1 ? prev + 1 : 0))
    }

    const handleError = (error: Event) => {
      console.error("Error loading audio:", error)
      setIsLoading(false)
      const audioError = error.target as HTMLAudioElement
      if (audioError.error) {
        console.error("Audio error code:", audioError.error.code)
        console.error("Audio error message:", audioError.error.message)
      }
    }

    audioElement.addEventListener("timeupdate", handleTimeUpdate)
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata)
    audioElement.addEventListener("ended", handleEnded)
    audioElement.addEventListener("error", handleError)

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate)
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audioElement.removeEventListener("ended", handleEnded)
      audioElement.removeEventListener("error", handleError)
    }
  }, [audioElement])

  // Update audio source when track changes
  useEffect(() => {
    if (!audioElement) return

    setIsLoading(true)
    audioElement.src = musicTracks[currentTrack].audioSrc
    if (isPlaying) {
      audioElement.play().catch(console.error)
    }
  }, [currentTrack, audioElement])

  // Handle play/pause
  useEffect(() => {
    if (!audioElement) return

    if (isPlaying) {
      audioElement.play().catch(console.error)
    } else {
      audioElement.pause()
    }
  }, [isPlaying, audioElement])

  // Handle volume changes
  useEffect(() => {
    if (!audioElement) return
    audioElement.volume = volume / 100
  }, [volume, audioElement])

  // Format time function
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (appState === "cnos-xp") {
    return <CNOSDesktop />
  }

  if (appState === "opening-social") {
    return (
      <div
        className="min-h-screen bg-black text-green-400 font-mono relative"
        style={{ fontFamily: "Courier New, monospace" }}
      >
        <BackgroundLines />
        <motion.div
          className="flex items-center justify-center min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center space-y-4">
            <div className="text-2xl">Opening {currentSocial}...</div>
            <div className="flex justify-center space-x-2">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: delay,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (appState === "boot-logs") {
    return (
      <div
        className="min-h-screen bg-black text-green-400 font-mono p-4 overflow-hidden relative"
        style={{ fontFamily: "Courier New, monospace" }}
      >
        <BackgroundLines />
        <div className="space-y-1 text-xs relative z-10">
          {completedLogs.map((log, index) => (
            <div key={index} className="flex">
              <span className="text-green-600 mr-2">[ 0.{String(index + 10000).padStart(6, "0")}]</span>
              <span>{log}</span>
            </div>
          ))}
          {currentLogText && (
            <div className="flex">
              <span className="text-green-600 mr-2">[ 0.{String(currentLogIndex + 10000).padStart(6, "0")}]</span>
              <span>{currentLogText}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (appState === "boot-screen") {
    return (
      <div
        className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-8 relative"
        style={{ fontFamily: "Courier New, monospace" }}
      >
        <BackgroundLines />
        <AnimatePresence>
          <motion.div
            className="text-center space-y-6 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-sm text-green-500 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Booting
            </motion.div>

            <motion.pre
              className="text-green-400 text-sm md:text-base leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {cnosAscii}
            </motion.pre>

            <motion.div
              className="text-lg text-green-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Chris Nikhil's Operating System
            </motion.div>

            <motion.div
              className="text-sm text-green-500 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              v7.2.1-secure • Quantum-Enhanced • Neural-Integrated
            </motion.div>

            <motion.div
              className="flex justify-center space-x-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              {[0, 0.3, 0.6, 0.9].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: delay,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  if (appState === "terminal") {
    return (
      <div
        className="min-h-screen bg-black text-green-400 font-mono p-4 relative"
        style={{ fontFamily: "Courier New, monospace" }}
      >
        <BackgroundLines />
        <div ref={terminalRef} className="h-screen overflow-y-auto pb-20 relative z-10">
          <div className="space-y-1 text-sm">
            {terminalHistory.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>

          <div className="flex items-center mt-2 space-x-2">
            <span className="text-green-300 text-lg font-bold">$</span>
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none outline-none text-green-400 font-mono text-sm p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter command..."
                autoComplete="off"
                spellCheck="false"
                style={{ fontFamily: "Courier New, monospace" }}
              />
              {showCursor && currentInput.length === 0 && (
                <span className="absolute left-0 top-0 bg-green-400 w-2 h-4 animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative" style={{ fontFamily: "Courier New, monospace" }}>
      <BackgroundLines />
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="border-b border-green-400/20 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Chris Nikhil</h1>
              <p className="text-green-300 text-sm">Full Stack Developer & Blockchain Developer</p>
            </div>
            <div className="flex items-center space-x-4">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300 backdrop-blur-sm"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-black border-green-400 text-green-400">
                  <DrawerHeader>
                    <DrawerTitle className="text-green-300">Navigation</DrawerTitle>
                    <DrawerDescription className="text-green-400">Quick access to portfolio sections</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-black/80 border border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-black/80 border border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-black/80 border border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button className="bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300">
                        Close
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <Button
                className="bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300 backdrop-blur-sm"
                onClick={() => setAppState("terminal")}
              >
                <Terminal className="mr-2 h-4 w-4" />
                Terminal
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* About Section */}
          <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="bg-black/50 border-green-400/30 text-green-400">
              <CardHeader>
                <CardTitle className="text-green-300">About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {
                    "I'm a passionate developer with expertise in full-stack development, AI, and blockchain technologies. With over 2 years of experience building cutting-edge applications, I specialize in creating intuitive and performant user experiences."
                  }
                </p>
                <p>
                  {
                    "My approach combines technical excellence with creative problem-solving, allowing me to deliver solutions that not only meet but exceed expectations."
                  }
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Skills Chart */}
          <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card className="bg-black/50 border-green-400/30 text-green-400">
              <CardHeader>
                <CardTitle className="text-green-300">Technical Skills</CardTitle>
                <CardDescription className="text-green-400/70">Proficiency levels in key technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    level: {
                      label: "Skill Level",
                      color: "#4ade80",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillsData}>
                      <XAxis dataKey="name" tick={{ fill: "#4ade80", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#4ade80", fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="level" fill="#4ade80" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.section>

          {/* Projects Carousel */}
          <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <Card className="bg-black/50 border-green-400/30 text-green-400">
              <CardHeader>
                <CardTitle className="text-green-300">Featured Projects</CardTitle>
                <CardDescription className="text-green-400/70">Showcase of recent work and innovations</CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full max-w-5xl mx-auto" opts={{ loop: true }}>
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {projectsData.map((project, index) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <Card className="bg-black/30 border-green-400/20 text-green-400 h-full">
                          <CardHeader>
                            <div className="text-4xl mb-2">{project.image}</div>
                            <CardTitle className="text-green-300 text-lg">{project.title}</CardTitle>
                            <Badge variant="outline" className="border-green-400 text-green-400 w-fit">
                              {project.status}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm">{project.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.map((tech) => (
                                <Badge
                                  key={tech}
                                  variant="secondary"
                                  className="bg-green-400/10 text-green-400 text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              className="bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300 w-full"
                              onClick={() => window.open(project.link, '_blank')}
                            >
                              View Project
                            </Button>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300" />
                  <CarouselNext className="bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300" />
                </Carousel>
              </CardContent>
            </Card>
          </motion.section>

          {/* Calendar & Contact */}
          <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-green-400/30 text-green-400">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {systemTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <CardDescription className="text-green-400/70">
                    Incase you forgot XD
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-green-400/20"
                    classNames={{
                      months: "text-green-400",
                      month: "space-y-4",
                      caption: "text-green-300",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 text-green-400 hover:bg-green-400/10",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-green-400/70 rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-green-400/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal text-green-400 hover:bg-green-400/10 rounded-md",
                      day_selected:
                        "bg-green-400 text-black hover:bg-green-400 hover:text-black focus:bg-green-400 focus:text-black",
                      day_today: "bg-green-400/20 text-green-300",
                      day_outside: "text-green-400/30",
                      day_disabled: "text-green-400/30",
                      day_range_middle: "aria-selected:bg-green-400/10 aria-selected:text-green-400",
                      day_hidden: "invisible",
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-400/30 text-green-400">
                <CardHeader>
                  <CardTitle className="text-green-300">Get In Touch</CardTitle>
                  <CardDescription className="text-green-400/70">
                    {"Let's build something amazing together"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button className="w-full justify-start bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300">
                      <Mail className="mr-2 h-4 w-4" />
                      chrsnikhil@gmail.com
                    </Button>
                    <Button className="w-full justify-start bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300">
                      <Github className="mr-2 h-4 w-4" />
                      github.com/chrsnikhil
                    </Button>
                    <Button className="w-full justify-start bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300">
                      <Linkedin className="mr-2 h-4 w-4" />
                      linkedin.com/in/chris-nikhil
                    </Button>
                    <Button
                      className="w-full justify-start bg-black/80 border-2 border-green-400 text-green-400 hover:bg-green-400/20 hover:text-green-300"
                      onClick={downloadResume}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-green-400/20">
                    <p className="text-sm text-green-400/70">
                      <strong className="text-green-300">Location:</strong> Chennai, India
                    </p>
                    <p className="text-sm text-green-400/70">
                      <strong className="text-green-300">Timezone:</strong> IST (GMT+5:30)
                    </p>
                    <p className="text-sm text-green-400/70">
                      <strong className="text-green-300">Status:</strong> Available for new opportunities
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  )
}
