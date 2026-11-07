/**
 * @file VicNlpProductPage.tsx
 * @description Dedicated landing and overview page for Vic — The AI-Powered Computer Interface (v0.3.0).
 * Based on the official PyPI release: https://pypi.org/project/vic-nlp/
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ExternalLink,
  Terminal,
  Lock,
  Cpu,
  Monitor,
  Code2,
  Copy,
  Check,
  Play,
  Layers,
  Wand2,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';

export const VicNlpProductPage: React.FC = () => {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [activeTab, setActiveTab] = useState<'cli' | 'gui' | 'interactive' | 'automl'>('gui');
  const [activeExample, setActiveExample] = useState<'calculator' | 'snake' | 'ip'>('calculator');

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('pip install psutil requests\npip install vic-nlp');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const KEY_FEATURES = [
    {
      icon: <Boxes className="w-5 h-5 text-indigo-500" />,
      title: 'AI No-Code Studio',
      badge: 'AutoML',
      desc: 'Train, evaluate, and export AI models with zero coding directly on your local workstation.',
    },
    {
      icon: <Wand2 className="w-5 h-5 text-blue-500" />,
      title: 'Zero Code Interface',
      badge: 'Natural Language',
      desc: 'Control your system or build functional desktop and web apps by just describing what you need in plain English.',
    },
    {
      icon: <Monitor className="w-5 h-5 text-emerald-500" />,
      title: 'Visual Dashboard',
      badge: 'GUI Assistant',
      desc: 'A multi-tab desktop dashboard with Peek Assistant and AI Training workflows launched via vic --gui.',
    },
    {
      icon: <Code2 className="w-5 h-5 text-amber-500" />,
      title: 'Editable Apps',
      badge: 'Clean Python',
      desc: 'Generates clean, readable, heavily-commented Python source code that you can open and modify at any time.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      title: 'Smarter Engine',
      badge: 'Fault Tolerant',
      desc: 'Auto-corrects user typos and provides intelligent, contextual suggestions for system commands.',
    },
    {
      icon: <Lock className="w-5 h-5 text-rose-500" />,
      title: 'Local & Private',
      badge: '100% On-Device',
      desc: 'All AI training, code generation, and commands execute locally on your PC with zero data leakage.',
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Product Hero */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            v0.3.0 • Latest PyPI Release
          </span>
          <span className="text-xs font-mono text-slate-500">Python &gt;= 3.7</span>
          <span className="text-xs font-mono text-slate-500">• Maintainer: victorraj020</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Vic — The AI-Powered Computer Interface
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            A library built for Natural Language Creation and No-Code AI. Control your computer, generate functional software, and train AI models using simple English.
          </p>
        </div>

        {/* Action & Install Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <span className="text-slate-400 select-none mr-2">$</span>
            <span>pip install vic-nlp</span>
            <button
              onClick={handleCopyInstall}
              className="ml-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Copy install command"
            >
              {copiedInstall ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <a
            href="https://pypi.org/project/vic-nlp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <span>View on PyPI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Link
            to="/terminal"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            Try Vic CLI in Terminal
          </Link>

          <Link
            to="/docs/vic-pipeline"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            Documentation
          </Link>
        </div>
      </div>

      {/* Package Provenance & Metadata Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">PyPI Package</span>
          <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-0.5">vic-nlp</div>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Current Release</span>
          <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">v0.3.0</div>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Python Compatibility</span>
          <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-0.5">&gt;= 3.7</div>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Maintainer</span>
          <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-0.5">victorraj020</div>
        </div>
      </div>

      {/* 6 Key Features */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
            Core Capabilities
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Engineered for Natural Language Creation &amp; No-Code AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {KEY_FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
                  {feat.icon}
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {feat.badge}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Installation & Quick Start Modes */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
            Quick Start Guide
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Three Modes of Execution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Launch the visual dashboard, execute one-liner system instructions, or enter interactive shell mode.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('gui')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'gui'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            1. Visual Dashboard (vic --gui)
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'cli'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            2. Command Line (vic &quot;...&quot;)
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'interactive'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            3. Interactive Mode (vic -i)
          </button>
          <button
            onClick={() => setActiveTab('automl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'automl'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            4. AI No-Code Studio (AutoML)
          </button>
        </div>

        {/* Active Tab Panel */}
        {activeTab === 'gui' && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    The Dashboard (Highly Recommended)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Launch the visual interface to start creating apps and training models with a single command.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  Recommended
                </span>
              </div>

              <CodeBlock
                language="bash"
                filename="terminal"
                code={`# Install recommended dependencies
pip install psutil requests

# Install Vic from PyPI
pip install vic-nlp

# Launch the visual dashboard
vic --gui`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    Peek Assistant Tab
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Natural language assistant for quick desktop actions, system diagnostics, and code generation.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    AI Training Tab
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    No-code AutoML workflow to load datasets, train local models, evaluate metrics, and export artifacts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cli' && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Command Line Quick Execution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Run quick instructions straight from your terminal without opening a GUI.
                </p>
              </div>

              <CodeBlock
                language="bash"
                filename="terminal"
                code={`# Open desktop applications
vic "open calculator"
vic "open notepad"

# Generate complete, runnable Python applications
vic "make a snake game"
vic "make a calculator"

# Search and inspect documentation
vic "search for vic library documentation"

# System query
vic "what is my ip address"`}
              />
            </div>
          </div>
        )}

        {activeTab === 'interactive' && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Interactive Mode (REPL)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Maintain an interactive session with memory for consecutive instructions.
                </p>
              </div>

              <CodeBlock
                language="bash"
                filename="terminal"
                code={`# Launch interactive REPL mode
vic -i

# Interactive prompt session:
# vic> open calculator
# [Vic] Launching Calculator... Done.
# vic> what is my ip address
# [Vic] Local IP: 192.168.1.104
# vic> make a todo app
# [Vic] Synthesizing todo_app.py with Tkinter GUI... Generated.`}
              />
            </div>
          </div>
        )}

        {activeTab === 'automl' && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  AI No-Code Studio (AutoML)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Train machine learning models with zero coding, evaluate performance, and export clean inference scripts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Step 1: Load Data
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Dataset Ingestion</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Point to any CSV or JSON dataset. Vic automatically cleans null values, encodes categoricals, and splits train/test sets.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    Step 2: Train
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Automated Model Search</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Vic benchmarks candidate classifiers and regressors locally with cross-validation to select the best architecture.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Step 3: Export
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Standalone Code</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Exports standalone, commented Python inference scripts and serialized model weights with zero proprietary lock-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Making & Modifying Section */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
            Learn by Modifying
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Making &amp; Modifying: Clean, Editable Code
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Vic is designed to help developers and learners understand how software works. When you ask Vic to generate an application, it outputs clean, standalone, heavily-commented Python code. In the visual dashboard, click <strong>&quot;Modify in Editor&quot;</strong> to inspect and customize it immediately.
          </p>
        </div>

        {/* Example Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveExample('calculator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeExample === 'calculator'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            calculator_app.py
          </button>
          <button
            onClick={() => setActiveExample('snake')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeExample === 'snake'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            snake_game.py
          </button>
          <button
            onClick={() => setActiveExample('ip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeExample === 'ip'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            sys_info.py
          </button>
        </div>

        {activeExample === 'calculator' && (
          <CodeBlock
            language="python"
            filename="calculator_app.py (Generated by: vic 'make a calculator')"
            code={`"""
Calculator Application — Generated by Vic (vic-nlp)
Click "Modify in Editor" inside Vic Dashboard (vic --gui) to customize.
"""
import tkinter as tk

class Calculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Vic Calculator")
        self.root.geometry("300x400")
        
        # Display entry
        self.expression = ""
        self.entry = tk.Entry(root, font=("Arial", 20), bd=8, insertwidth=4, width=14, justify="right")
        self.entry.grid(row=0, column=0, columnspan=4, pady=10)
        
        # Define button layout
        buttons = [
            ('7', 1, 0), ('8', 1, 1), ('9', 1, 2), ('/', 1, 3),
            ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('*', 2, 3),
            ('1', 3, 0), ('2', 3, 1), ('3', 3, 2), ('-', 3, 3),
            ('0', 4, 0), ('C', 4, 1), ('=', 4, 2), ('+', 4, 3),
        ]
        
        for (text, row, col) in buttons:
            self.create_button(text, row, col)

    def create_button(self, text, row, col):
        action = lambda x=text: self.on_click(x)
        tk.Button(self.root, text=text, padx=20, pady=20, font=("Arial", 12), command=action).grid(row=row, column=col)

    def on_click(self, char):
        if char == '=':
            try:
                self.expression = str(eval(self.expression))
            except Exception:
                self.expression = "Error"
        elif char == 'C':
            self.expression = ""
        else:
            self.expression += str(char)
            
        self.entry.delete(0, tk.END)
        self.entry.insert(0, self.expression)

if __name__ == "__main__":
    root = tk.Tk()
    calc = Calculator(root)
    root.mainloop()`}
          />
        )}

        {activeExample === 'snake' && (
          <CodeBlock
            language="python"
            filename="snake_game.py (Generated by: vic 'make a snake game')"
            code={`"""
Snake Game — Generated by Vic (vic-nlp)
Run directly: python snake_game.py
"""
import turtle
import time
import random

delay = 0.1
score = 0
high_score = 0

# Set up the screen
wn = turtle.Screen()
wn.title("Vic Snake Game")
wn.bgcolor("black")
wn.setup(width=600, height=600)
wn.tracer(0)

# Snake head
head = turtle.Turtle()
head.speed(0)
head.shape("square")
head.color("green")
head.penup()
head.goto(0, 0)
head.direction = "stop"

# Snake food
food = turtle.Turtle()
food.speed(0)
food.shape("circle")
food.color("red")
food.penup()
food.goto(0, 100)

segments = []

# Functions
def go_up():
    if head.direction != "down":
        head.direction = "up"

def go_down():
    if head.direction != "up":
        head.direction = "down"

def go_left():
    if head.direction != "right":
        head.direction = "left"

def go_right():
    if head.direction != "left":
        head.direction = "right"

# Keyboard bindings
wn.listen()
wn.onkeypress(go_up, "Up")
wn.onkeypress(go_down, "Down")
wn.onkeypress(go_left, "Left")
wn.onkeypress(go_right, "Right")

print("Game initialized. Press arrow keys to control.")`}
          />
        )}

        {activeExample === 'ip' && (
          <CodeBlock
            language="python"
            filename="sys_info.py (Generated by: vic 'what is my ip address')"
            code={`"""
System Diagnostic Query — Generated by Vic (vic-nlp)
Using psutil and requests
"""
import socket
import psutil
import requests

def get_system_diagnostics():
    # 1. Local IP address
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    
    # 2. Memory & CPU utilization (via psutil)
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    
    # 3. Public IP address query (via requests)
    try:
        public_ip = requests.get('https://api.ipify.org?format=json', timeout=3).json().get('ip')
    except Exception:
        public_ip = "Offline / Not Available"
        
    return {
        "hostname": hostname,
        "local_ip": local_ip,
        "public_ip": public_ip,
        "cpu_usage": f"{cpu_percent}%",
        "ram_available_gb": round(memory.available / (1024**3), 2),
    }

if __name__ == "__main__":
    info = get_system_diagnostics()
    for k, v in info.items():
        print(f"  {k}: {v}")`}
          />
        )}
      </div>

      {/* Security & Local Privacy Architecture */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c0d12] p-8 sm:p-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300">
            <Lock className="w-3 h-3" />
            100% Local Execution
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Local &amp; Private: All AI Training and Commands Execute on Your PC
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            Unlike cloud-hosted AI coding tools that transmit your source files and workspace metadata to third-party servers, Vic is designed to run locally. All system automations use standard Python system libraries (<code>psutil</code>, <code>socket</code>, <code>os</code>), and all machine learning workflows train on your local CPU or GPU.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1">
            <div className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
              Zero Cloud Telemetry
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              No tracking of developer keystrokes, source code, or internal commands.
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
              Air-Gapped Workflows
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Run offline without an internet connection for secure enterprise and research workstations.
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
              Full Python Ecosystem
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Generated apps are pure Python — inspect, debug, and package into wheels without any lock-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
