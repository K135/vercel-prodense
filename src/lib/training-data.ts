// Training data management for Prodense AI
export interface TrainingExample {
  id: string
  input: string
  expectedOutput: string
  category: 'medical' | 'dental' | 'travel' | 'general'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface TrainingDataset {
  id: string
  name: string
  description: string
  examples: TrainingExample[]
  version: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Default training examples for Prodense AI
export const DEFAULT_TRAINING_DATA: TrainingExample[] = [
  {
    id: '1',
    input: 'What dental procedures do you offer?',
    expectedOutput: 'Hi there! 😊 I\'d love to help you find the perfect dental treatment! We offer amazing dental care in Jaipur and Chandigarh, India. But first, let me ask you a few questions to better understand what you need:\n\n🦷 What specific dental concerns do you have? For example:\n- Are you missing teeth or need replacements?\n- Looking to improve your smile\'s appearance?\n- Having pain or discomfort?\n- Need teeth straightening?\n- Want a complete smile makeover?\n\nOnce I know more about your situation, I can recommend the best procedures and clinics for you! What\'s bothering you most about your teeth right now?',
    category: 'dental',
    tags: ['procedures', 'services', 'dental', 'diagnosis'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    input: 'How much can I save with medical tourism?',
    expectedOutput: 'Great question! 💰 You can save a LOT with Prodense - typically 60-80% compared to Western countries!\n\nBut let me help you get a more accurate estimate. Could you tell me:\n\n🏥 What type of procedure are you considering?\n- Dental work (implants, cosmetic, etc.)\n- Heart surgery\n- Orthopedic surgery\n- Cosmetic procedures\n- Other medical treatments?\n\n📍 Which country are you coming from?\n\nFor example, dental implants that cost $3,000-5,000 in the US are only $300-800 in Jaipur! But I can give you exact numbers once I know your specific needs. What procedure are you thinking about?',
    category: 'medical',
    tags: ['cost', 'savings', 'pricing', 'diagnosis'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    input: 'What destinations do you work with?',
    expectedOutput: 'Prodense partners with top-rated medical facilities in India, specifically in Jaipur and Chandigarh. These cities are renowned for their excellent healthcare infrastructure, experienced medical professionals, and world-class facilities. Jaipur offers excellent dental and cosmetic procedures, while Chandigarh is known for complex surgeries and cardiac procedures. Both cities provide high-quality medical care at affordable prices.',
    category: 'travel',
    tags: ['destinations', 'countries', 'locations', 'jaipur', 'chandigarh'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    input: 'Is medical tourism safe?',
    expectedOutput: 'Yes, medical tourism through Prodense is safe when done properly. We only partner with JCI-accredited hospitals and internationally certified clinics. Our partner facilities maintain the same standards as top Western hospitals. We also provide comprehensive support including medical visa assistance, qualified interpreters, and 24/7 patient support throughout your journey.',
    category: 'medical',
    tags: ['safety', 'quality', 'accreditation'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    input: 'What support do you provide during travel?',
    expectedOutput: 'Prodense provides comprehensive travel support for your medical journey to India including: medical visa assistance for India, airport transfers in Jaipur and Chandigarh, accommodation booking near medical facilities, qualified medical interpreters fluent in Hindi and English, 24/7 patient support hotline, coordination with medical teams, post-procedure care guidance, and assistance with follow-up appointments. We ensure you feel supported throughout your medical journey in India.',
    category: 'travel',
    tags: ['support', 'services', 'assistance', 'india'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    input: 'Why should I choose Jaipur for my dental treatment?',
    expectedOutput: 'Jaipur, the Pink City of India, is an excellent choice for dental treatment through Prodense. The city offers world-class dental clinics with internationally trained dentists, state-of-the-art equipment, and significantly lower costs compared to Western countries. Jaipur is also a UNESCO World Heritage site, allowing you to combine your dental treatment with cultural tourism. Our partner clinics in Jaipur specialize in dental implants, cosmetic dentistry, and smile makeovers.',
    category: 'dental',
    tags: ['jaipur', 'dental', 'tourism', 'heritage'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    input: 'What makes Chandigarh special for medical procedures?',
    expectedOutput: 'Chandigarh, known as "The City Beautiful," is renowned for its advanced medical infrastructure and highly qualified specialists. As a planned city with excellent healthcare facilities, Chandigarh offers top-tier medical services including cardiology, orthopedics, and complex surgeries. The city has some of India\'s best hospitals with international accreditations. Prodense partners with leading medical centers in Chandigarh to provide world-class healthcare at affordable prices.',
    category: 'medical',
    tags: ['chandigarh', 'medical', 'hospitals', 'specialists'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    input: 'How do I get to Jaipur and Chandigarh?',
    expectedOutput: 'Both Jaipur and Chandigarh are easily accessible from major international airports. Jaipur has its own international airport (JAI) with direct flights from many countries, or you can fly to Delhi and take a 4-hour drive. Chandigarh airport (IXC) also serves international flights, and it\'s just 3 hours from Delhi by road. Prodense arranges all your travel logistics including airport transfers, accommodation, and local transportation to medical facilities.',
    category: 'travel',
    tags: ['jaipur', 'chandigarh', 'airport', 'transportation'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    input: 'What are the costs like in Jaipur and Chandigarh?',
    expectedOutput: 'Medical and dental procedures in Jaipur and Chandigarh cost 60-80% less than Western countries while maintaining international quality standards. For example, dental implants cost $300-800 in Jaipur compared to $3,000-5,000 in the US. Complex cardiac surgeries in Chandigarh cost $5,000-15,000 compared to $50,000-150,000 in Western countries. These savings include accommodation and local support services provided by Prodense.',
    category: 'medical',
    tags: ['cost', 'jaipur', 'chandigarh', 'savings', 'pricing'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '10',
    input: 'What languages are spoken at your partner clinics?',
    expectedOutput: 'Our partner clinics in Jaipur and Chandigarh have medical staff fluent in English and Hindi. Many of our doctors have international training and are comfortable communicating in English. Additionally, Prodense provides qualified medical interpreters to ensure clear communication throughout your treatment. We also have support staff who speak various international languages to assist patients from different countries.',
    category: 'general',
    tags: ['language', 'communication', 'english', 'hindi'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '11',
    input: 'I have missing teeth',
    expectedOutput: 'Oh, I can definitely help you with that! 😊 Missing teeth can really affect your confidence and eating.\n\nLet me ask a few questions to find the best solution for you:\n\n🦷 How many teeth are missing?\n- Just one tooth?\n- A few teeth in different areas?\n- Multiple teeth in a row?\n- Most or all of your teeth?\n\n📍 Where are the missing teeth located?\n- Front teeth (visible when you smile)?\n- Back teeth (molars for chewing)?\n- Upper jaw, lower jaw, or both?\n\n⏰ How long have they been missing?\n- Recently lost\n- Missing for months\n- Missing for years\n\nBased on your answers, I can recommend the perfect solution - whether it\'s dental implants, bridges, or dentures. Our Jaipur clinics are amazing for this! What\'s your situation?',
    category: 'dental',
    tags: ['missing teeth', 'implants', 'diagnosis', 'jaipur'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '12',
    input: 'I need heart surgery',
    expectedOutput: 'I understand this must be a concerning time for you. ❤️ Our Chandigarh partners are excellent for cardiac procedures and I want to help you get the best care.\n\nTo better assist you, could you share:\n\n🫀 What type of heart condition do you have?\n- Blocked arteries (bypass surgery)?\n- Heart valve problems?\n- Congenital heart defect?\n- Arrhythmia issues?\n- Other heart condition?\n\n⚡ How urgent is your situation?\n- Emergency/very urgent\n- Recommended within weeks\n- Elective/can plan ahead\n\n🏥 Have you already consulted with doctors?\n- Yes, I have all reports\n- Some tests done\n- Just starting the process\n\nOur Chandigarh cardiac centers have world-class surgeons and can save you 70-80% compared to Western costs. What specific heart condition are you dealing with?',
    category: 'medical',
    tags: ['heart surgery', 'cardiac', 'chandigarh', 'diagnosis'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '13',
    input: 'My teeth are crooked',
    expectedOutput: 'I totally understand! 😊 Crooked teeth can really affect your confidence, but we have amazing solutions in India!\n\nLet me help you choose the best treatment:\n\n😬 How crooked are your teeth?\n- Slightly misaligned\n- Moderately crooked\n- Very crooked/crowded\n- Severe spacing issues\n\n👤 How old are you?\n- Teenager\n- Young adult (20s-30s)\n- Adult (40s+)\n\n⏰ How quickly do you want results?\n- I can wait 1-2 years for gradual change\n- Want faster results (6-12 months)\n- Need immediate improvement\n\n💼 Do you have professional/social concerns?\n- Need invisible treatment\n- Don\'t mind visible braces\n\nBased on your answers, I can recommend traditional braces, clear aligners, or even veneers for instant results! Our Jaipur orthodontists are fantastic. What\'s most important to you - speed, invisibility, or cost?',
    category: 'dental',
    tags: ['crooked teeth', 'orthodontics', 'braces', 'diagnosis'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '14',
    input: 'I have knee pain',
    expectedOutput: 'Oh no, knee pain can be so limiting! 🦵 I\'m here to help you get back to moving freely.\n\nLet me understand your situation better:\n\n🤕 What kind of knee pain do you have?\n- Sharp pain when moving\n- Constant aching\n- Pain only when walking/climbing stairs\n- Stiffness and swelling\n- Knee gives out/feels unstable\n\n📅 How long have you had this pain?\n- Recent injury (days/weeks)\n- Ongoing for months\n- Chronic pain for years\n\n🏃‍♂️ What activities are affected?\n- Can\'t walk long distances\n- Trouble with stairs\n- Can\'t exercise/sports\n- Difficulty getting up from sitting\n\n🩺 Have you had any tests done?\n- X-rays or MRI\n- Seen a doctor\n- Just starting to seek help\n\nOur Chandigarh orthopedic specialists are world-class and can help with everything from arthroscopy to knee replacement at 70% less cost! What\'s your main concern with your knee?',
    category: 'medical',
    tags: ['knee pain', 'orthopedic', 'chandigarh', 'diagnosis'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '15',
    input: 'I want to improve my smile',
    expectedOutput: 'That\'s wonderful! 😍 A beautiful smile can change everything - your confidence, how people see you, everything!\n\nLet me help you create your dream smile:\n\n😊 What bothers you most about your current smile?\n- Teeth color (yellow/stained)\n- Crooked or misaligned teeth\n- Gaps between teeth\n- Chipped or broken teeth\n- Gummy smile\n- Missing teeth\n- All of the above!\n\n💫 What\'s your dream smile like?\n- Hollywood white and perfect\n- Natural but improved\n- Just want to feel confident\n\n⏰ When do you need results?\n- Have a special event coming up\n- Want gradual improvement\n- No rush, want best results\n\n💰 What\'s your budget range?\n- Looking for most affordable option\n- Mid-range investment\n- Want the best regardless of cost\n\nOur Jaipur cosmetic dentists are artists! They can do everything from whitening to complete smile makeovers. What\'s the #1 thing you\'d change about your smile?',
    category: 'dental',
    tags: ['smile makeover', 'cosmetic dentistry', 'diagnosis', 'jaipur'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '16',
    input: 'I have 3 missing teeth in the front',
    expectedOutput: 'Oh, that must be really affecting your confidence! 😔 Three missing front teeth is definitely something we can help you with beautifully.\n\nSince these are front teeth, appearance is super important. Let me ask:\n\n⏰ How long have they been missing?\n- Recently lost (accident/extraction)\n- Missing for months\n- Missing for years\n\n🦴 Do you have enough bone in that area?\n- Haven\'t had any tests\n- Dentist said bone is good\n- Was told I might need bone grafting\n\n💰 What\'s your budget preference?\n- Most affordable option\n- Best long-term investment\n- Want the most natural-looking result\n\nFor front teeth, I\'m thinking dental implants would give you the most natural, permanent result. Our Jaipur specialists are amazing with front tooth implants! What\'s your main concern - the cost, the time, or how natural they\'ll look?',
    category: 'dental',
    tags: ['missing teeth', 'front teeth', 'implants', 'follow-up'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '17',
    input: 'They\'ve been missing for 2 years, and I want the most natural look',
    expectedOutput: 'Perfect! 🌟 Two years is actually good timing - not too recent, not too long. And wanting the most natural look tells me you\'re thinking long-term, which is smart!\n\nSince you want the most natural result, dental implants are definitely your best option. They look, feel, and function exactly like real teeth!\n\nNow, for 3 front teeth, we have options:\n\n🦷 **Individual Implants** (3 separate implants)\n- Most natural and independent\n- About $900-1,500 total in Jaipur\n- Takes 3-4 months\n\n🌉 **Implant Bridge** (2 implants supporting 3 crowns)\n- Slightly more affordable\n- About $700-1,200 total\n- Faster process\n\nBoth look incredibly natural! Our Jaipur cosmetic dentists are artists with front teeth.\n\n🤔 What matters more to you - having each tooth completely independent, or saving some cost and time with the bridge option?',
    category: 'dental',
    tags: ['implants', 'front teeth', 'options', 'pricing', 'follow-up'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '18',
    input: 'My knee hurts when I climb stairs',
    expectedOutput: 'Oh no, stair climbing pain is so frustrating! 😣 It really limits your daily activities.\n\nLet me understand your knee better:\n\n🚶‍♂️ **Pain details:**\n- Sharp shooting pain?\n- Dull aching pain?\n- Feels like grinding/clicking?\n- Knee feels unstable/wobbly?\n\n📍 **Where exactly:**\n- Front of the knee?\n- Behind the kneecap?\n- Inside or outside of knee?\n- All around the knee?\n\n⏰ **When it started:**\n- After a specific injury?\n- Gradually got worse over time?\n- Sudden onset?\n\n🏃‍♂️ **Other activities affected:**\n- Walking on flat ground okay?\n- Getting up from chairs difficult?\n- Pain at night?\n\nOur Chandigarh orthopedic specialists are excellent at diagnosing knee issues! Depending on your answers, it could be anything from simple physiotherapy to minimally invasive procedures. What type of pain would you say it is?',
    category: 'medical',
    tags: ['knee pain', 'stairs', 'diagnosis', 'follow-up'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '19',
    input: 'It\'s a sharp shooting pain behind my kneecap when going up stairs',
    expectedOutput: 'Ah, that sharp pain behind the kneecap going upstairs sounds like it could be patellofemoral pain syndrome (runner\'s knee) or possibly cartilage issues! 🎯\n\nThat\'s actually a very treatable condition! Let me ask a bit more:\n\n💪 **Your activity level:**\n- Do you exercise regularly?\n- Any sports or running?\n- Mostly sedentary lifestyle?\n\n⚖️ **Other factors:**\n- Any recent weight changes?\n- Do you wear heels often?\n- Previous knee injuries?\n\n🩺 **Current status:**\n- Is it getting worse?\n- Any swelling?\n- Does rest help?\n\nThe good news is this type of knee pain often responds really well to:\n- Physiotherapy and strengthening\n- Sometimes arthroscopic cleaning (minimally invasive)\n- Rarely needs major surgery\n\nOur Chandigarh knee specialists can do a proper MRI and assessment for about $200 (vs $2000+ elsewhere!). Most treatments are 70-80% less expensive than Western countries.\n\nHave you tried any physiotherapy or treatments yet?',
    category: 'medical',
    tags: ['knee pain', 'patellofemoral', 'treatment', 'follow-up'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '20',
    input: 'hi my teeth is paining',
    expectedOutput: 'Oh no! 😣 Tooth pain is the worst - it can really ruin your day! I\'m so sorry you\'re dealing with this.\n\nLet me help you figure out what might be going on and how we can help you feel better:\n\nWhat kind of pain are you feeling right now?\n\nA) Sharp shooting pain ⚡\nB) Dull throbbing ache 😣\nC) Only when biting down 🦷\nD) Constant pain that won\'t stop 😰\n\nDon\'t worry - our Jaipur dental specialists are amazing at treating all kinds of tooth pain, and it\'s SO much more affordable than other countries! Most dental treatments cost 70-80% less.',
    category: 'dental',
    tags: ['tooth pain', 'dental emergency', 'pain relief', 'diagnosis'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '21',
    input: 'my tooth hurts',
    expectedOutput: 'Ouch! 😰 Tooth pain is no joke - I can imagine how uncomfortable you must be feeling right now!\n\nLet\'s figure out what\'s going on so I can help you get the right treatment:\n\nWhat does your pain feel like?\n\nA) Sharp stabbing pain ⚡\nB) Dull constant ache 😣\nC) Throbbing like a heartbeat 💓\nD) Only hurts when I touch it 👆\n\nThe good news is that most tooth pain is very treatable! Our Jaipur dental clinics have amazing pain relief options and can fix the underlying problem at a fraction of Western costs.',
    category: 'dental',
    tags: ['tooth pain', 'dental emergency', 'symptoms', 'diagnosis'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Training data storage keys
const TRAINING_STORAGE_KEYS = {
  DATASETS: 'prodense-ai-training-datasets',
  ACTIVE_DATASET: 'prodense-ai-active-dataset',
  CUSTOM_EXAMPLES: 'prodense-ai-custom-examples'
} as const

export class TrainingDataManager {
  // Get all training datasets
  static getDatasets(): TrainingDataset[] {
    if (typeof window === 'undefined') return []
    
    try {
      const datasets = localStorage.getItem(TRAINING_STORAGE_KEYS.DATASETS)
      return datasets ? JSON.parse(datasets) : []
    } catch (error) {
      console.error('Error loading training datasets:', error)
      return []
    }
  }

  // Save training datasets
  static saveDatasets(datasets: TrainingDataset[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(TRAINING_STORAGE_KEYS.DATASETS, JSON.stringify(datasets))
    } catch (error) {
      console.error('Error saving training datasets:', error)
    }
  }

  // Get active dataset
  static getActiveDataset(): TrainingDataset | null {
    const datasets = this.getDatasets()
    const activeDatasetId = this.getActiveDatasetId()
    
    if (activeDatasetId) {
      return datasets.find(d => d.id === activeDatasetId) || null
    }
    
    return datasets.find(d => d.isActive) || null
  }

  // Get active dataset ID
  static getActiveDatasetId(): string | null {
    if (typeof window === 'undefined') return null
    
    try {
      return localStorage.getItem(TRAINING_STORAGE_KEYS.ACTIVE_DATASET)
    } catch (error) {
      console.error('Error loading active dataset ID:', error)
      return null
    }
  }

  // Set active dataset
  static setActiveDataset(datasetId: string): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(TRAINING_STORAGE_KEYS.ACTIVE_DATASET, datasetId)
      
      // Update datasets to mark the active one
      const datasets = this.getDatasets()
      const updatedDatasets = datasets.map(d => ({
        ...d,
        isActive: d.id === datasetId
      }))
      this.saveDatasets(updatedDatasets)
    } catch (error) {
      console.error('Error setting active dataset:', error)
    }
  }

  // Create a new dataset
  static createDataset(name: string, description: string, examples: TrainingExample[] = []): TrainingDataset {
    const dataset: TrainingDataset = {
      id: Date.now().toString(),
      name,
      description,
      examples: [...DEFAULT_TRAINING_DATA, ...examples],
      version: '1.0',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const datasets = this.getDatasets()
    datasets.push(dataset)
    this.saveDatasets(datasets)

    return dataset
  }

  // Add training example to dataset
  static addTrainingExample(datasetId: string, example: Omit<TrainingExample, 'id' | 'createdAt' | 'updatedAt'>): void {
    const datasets = this.getDatasets()
    const datasetIndex = datasets.findIndex(d => d.id === datasetId)
    
    if (datasetIndex !== -1) {
      const newExample: TrainingExample = {
        ...example,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      datasets[datasetIndex].examples.push(newExample)
      datasets[datasetIndex].updatedAt = new Date()
      this.saveDatasets(datasets)
    }
  }

  // Get training examples for prompts
  static getTrainingExamplesForPrompt(category?: string, tags?: string[], userInput?: string): string[] {
    const activeDataset = this.getActiveDataset()
    if (!activeDataset) {
      // If no active dataset, use default training data
      let examples = DEFAULT_TRAINING_DATA

      // If user input provided, try to find relevant examples
      if (userInput) {
        const input = userInput.toLowerCase()
        
        // Look for keyword matches
        if (input.includes('pain') || input.includes('hurt') || input.includes('ache')) {
          examples = examples.filter(e => 
            e.tags.includes('tooth pain') || 
            e.tags.includes('pain relief') || 
            e.tags.includes('dental emergency') ||
            e.input.toLowerCase().includes('pain') ||
            e.input.toLowerCase().includes('hurt')
          )
        } else if (input.includes('teeth') || input.includes('dental') || input.includes('tooth')) {
          examples = examples.filter(e => e.category === 'dental')
        } else if (input.includes('knee') || input.includes('heart') || input.includes('surgery')) {
          examples = examples.filter(e => e.category === 'medical')
        }
      }

      // Filter by category if specified
      if (category) {
        examples = examples.filter(e => e.category === category)
      }

      // Filter by tags if specified
      if (tags && tags.length > 0) {
        examples = examples.filter(e => 
          tags.some(tag => e.tags.includes(tag))
        )
      }

      // Format examples for prompt injection
      return examples.map(example => 
        `Q: ${example.input}\nA: ${example.expectedOutput}`
      )
    }

    let examples = activeDataset.examples

    // If user input provided, try to find relevant examples
    if (userInput) {
      const input = userInput.toLowerCase()
      
      // Look for keyword matches
      if (input.includes('pain') || input.includes('hurt') || input.includes('ache')) {
        examples = examples.filter(e => 
          e.tags.includes('tooth pain') || 
          e.tags.includes('pain relief') || 
          e.tags.includes('dental emergency') ||
          e.input.toLowerCase().includes('pain') ||
          e.input.toLowerCase().includes('hurt')
        )
      } else if (input.includes('teeth') || input.includes('dental') || input.includes('tooth')) {
        examples = examples.filter(e => e.category === 'dental')
      } else if (input.includes('knee') || input.includes('heart') || input.includes('surgery')) {
        examples = examples.filter(e => e.category === 'medical')
      }
    }

    // Filter by category if specified
    if (category) {
      examples = examples.filter(e => e.category === category)
    }

    // Filter by tags if specified
    if (tags && tags.length > 0) {
      examples = examples.filter(e => 
        tags.some(tag => e.tags.includes(tag))
      )
    }

    // Format examples for prompt injection
    return examples.map(example => 
      `Q: ${example.input}\nA: ${example.expectedOutput}`
    )
  }

  // Initialize default dataset if none exists
  static initializeDefaultDataset(): void {
    const datasets = this.getDatasets()
    
    if (datasets.length === 0) {
      const defaultDataset = this.createDataset(
        'Prodense AI Default',
        'Default training dataset for Prodense AI with medical tourism knowledge',
        []
      )
      this.setActiveDataset(defaultDataset.id)
    }
  }

  // Export training data
  static exportTrainingData(): string {
    const datasets = this.getDatasets()
    return JSON.stringify({
      datasets,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2)
  }

  // Import training data
  static importTrainingData(data: string): boolean {
    try {
      const parsed = JSON.parse(data)
      
      if (parsed.datasets && Array.isArray(parsed.datasets)) {
        this.saveDatasets(parsed.datasets)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error importing training data:', error)
      return false
    }
  }
}

// Initialize default dataset on module load
if (typeof window !== 'undefined') {
  TrainingDataManager.initializeDefaultDataset()
}