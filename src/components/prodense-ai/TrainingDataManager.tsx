'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon,
  TrashIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  AcademicCapIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { TrainingDataManager, TrainingExample, TrainingDataset } from '@/lib/training-data'

interface TrainingDataManagerProps {
  isDarkMode: boolean
  isOpen: boolean
  onClose: () => void
}

export default function TrainingDataManagerComponent({ 
  isDarkMode, 
  isOpen, 
  onClose 
}: TrainingDataManagerProps) {
  const [datasets, setDatasets] = useState<TrainingDataset[]>([])
  const [activeDataset, setActiveDataset] = useState<TrainingDataset | null>(null)
  const [showAddExample, setShowAddExample] = useState(false)
  const [showCreateDataset, setShowCreateDataset] = useState(false)
  const [newExample, setNewExample] = useState({
    input: '',
    expectedOutput: '',
    category: 'general' as 'medical' | 'dental' | 'travel' | 'general',
    tags: ''
  })
  const [newDataset, setNewDataset] = useState({
    name: '',
    description: ''
  })

  // Load data on mount
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = () => {
    const allDatasets = TrainingDataManager.getDatasets()
    const active = TrainingDataManager.getActiveDataset()
    setDatasets(allDatasets)
    setActiveDataset(active)
  }

  const handleCreateDataset = () => {
    if (newDataset.name.trim()) {
      const dataset = TrainingDataManager.createDataset(
        newDataset.name.trim(),
        newDataset.description.trim()
      )
      setNewDataset({ name: '', description: '' })
      setShowCreateDataset(false)
      loadData()
    }
  }

  const handleAddExample = () => {
    if (activeDataset && newExample.input.trim() && newExample.expectedOutput.trim()) {
      TrainingDataManager.addTrainingExample(activeDataset.id, {
        input: newExample.input.trim(),
        expectedOutput: newExample.expectedOutput.trim(),
        category: newExample.category,
        tags: newExample.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      })
      setNewExample({
        input: '',
        expectedOutput: '',
        category: 'general',
        tags: ''
      })
      setShowAddExample(false)
      loadData()
    }
  }

  const handleSetActiveDataset = (datasetId: string) => {
    TrainingDataManager.setActiveDataset(datasetId)
    loadData()
  }

  const handleExportData = () => {
    const data = TrainingDataManager.exportTrainingData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prodense-ai-training-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (TrainingDataManager.importTrainingData(content)) {
          loadData()
          alert('Training data imported successfully!')
        } else {
          alert('Failed to import training data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={clsx(
          'w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden',
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        )}
      >
        {/* Header */}
        <div className={clsx(
          'px-6 py-4 border-b flex items-center justify-between',
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        )}>
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="h-6 w-6 text-[#D35C2F]" />
            <h2 className="text-xl font-bold">Training Data Manager</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportData}
              className={clsx(
                'px-3 py-2 rounded-lg transition-colors flex items-center space-x-2',
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              )}
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Export</span>
            </button>
            <label className={clsx(
              'px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer',
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            )}>
              <DocumentArrowUpIcon className="h-4 w-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            <button
              onClick={onClose}
              className={clsx(
                'px-3 py-2 rounded-lg transition-colors',
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              )}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar - Datasets */}
          <div className={clsx(
            'w-1/3 border-r overflow-y-auto',
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          )}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Datasets</h3>
                <button
                  onClick={() => setShowCreateDataset(true)}
                  className="p-2 rounded-lg bg-[#D35C2F] text-white hover:bg-[#B8491F] transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className={clsx(
                      'p-3 rounded-lg border cursor-pointer transition-colors',
                      dataset.isActive
                        ? 'border-[#D35C2F] bg-[#D35C2F]/10'
                        : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                    )}
                    onClick={() => handleSetActiveDataset(dataset.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{dataset.name}</h4>
                      {dataset.isActive && (
                        <span className="text-xs bg-[#D35C2F] text-white px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className={clsx(
                      'text-sm mt-1',
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {dataset.description}
                    </p>
                    <p className={clsx(
                      'text-xs mt-2',
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    )}>
                      {dataset.examples.length} examples
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Training Examples */}
          <div className="flex-1 flex flex-col">
            {activeDataset ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{activeDataset.name}</h3>
                      <p className={clsx(
                        'text-sm',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {activeDataset.examples.length} training examples
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddExample(true)}
                      className="px-4 py-2 bg-[#D35C2F] text-white rounded-lg hover:bg-[#B8491F] transition-colors flex items-center space-x-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Example</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {activeDataset.examples.map((example) => (
                      <div
                        key={example.id}
                        className={clsx(
                          'p-4 rounded-lg border',
                          isDarkMode ? 'border-gray-600' : 'border-gray-300'
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={clsx(
                              'px-2 py-1 text-xs rounded',
                              example.category === 'medical' ? 'bg-red-100 text-red-800' :
                              example.category === 'dental' ? 'bg-blue-100 text-blue-800' :
                              example.category === 'travel' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            )}>
                              {example.category}
                            </span>
                            {example.tags.map((tag) => (
                              <span
                                key={tag}
                                className={clsx(
                                  'px-2 py-1 text-xs rounded flex items-center space-x-1',
                                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                )}
                              >
                                <TagIcon className="h-3 w-3" />
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-green-600">Input:</label>
                            <p className={clsx(
                              'mt-1 text-sm',
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                              {example.input}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-blue-600">Expected Output:</label>
                            <p className={clsx(
                              'mt-1 text-sm',
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                              {example.expectedOutput}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className={clsx(
                  'text-lg',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Select a dataset to view training examples
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Create Dataset Modal */}
        <AnimatePresence>
          {showCreateDataset && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={clsx(
                  'w-full max-w-md p-6 rounded-xl',
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                )}
              >
                <h3 className="text-lg font-semibold mb-4">Create New Dataset</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={newDataset.name}
                      onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
                      className={clsx(
                        'w-full px-3 py-2 border rounded-lg',
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      )}
                      placeholder="Dataset name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newDataset.description}
                      onChange={(e) => setNewDataset({ ...newDataset, description: e.target.value })}
                      className={clsx(
                        'w-full px-3 py-2 border rounded-lg',
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      )}
                      rows={3}
                      placeholder="Dataset description"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateDataset(false)}
                    className={clsx(
                      'px-4 py-2 rounded-lg',
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateDataset}
                    className="px-4 py-2 bg-[#D35C2F] text-white rounded-lg hover:bg-[#B8491F]"
                  >
                    Create
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Example Modal */}
        <AnimatePresence>
          {showAddExample && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={clsx(
                  'w-full max-w-2xl p-6 rounded-xl max-h-[80vh] overflow-y-auto',
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                )}
              >
                <h3 className="text-lg font-semibold mb-4">Add Training Example</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Input (User Question)</label>
                    <textarea
                      value={newExample.input}
                      onChange={(e) => setNewExample({ ...newExample, input: e.target.value })}
                      className={clsx(
                        'w-full px-3 py-2 border rounded-lg',
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      )}
                      rows={3}
                      placeholder="What question should the AI be able to answer?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Output (AI Response)</label>
                    <textarea
                      value={newExample.expectedOutput}
                      onChange={(e) => setNewExample({ ...newExample, expectedOutput: e.target.value })}
                      className={clsx(
                        'w-full px-3 py-2 border rounded-lg',
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      )}
                      rows={5}
                      placeholder="How should the AI respond to this question?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={newExample.category}
                        onChange={(e) => setNewExample({ ...newExample, category: e.target.value as any })}
                        className={clsx(
                          'w-full px-3 py-2 border rounded-lg',
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        )}
                      >
                        <option value="general">General</option>
                        <option value="medical">Medical</option>
                        <option value="dental">Dental</option>
                        <option value="travel">Travel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={newExample.tags}
                        onChange={(e) => setNewExample({ ...newExample, tags: e.target.value })}
                        className={clsx(
                          'w-full px-3 py-2 border rounded-lg',
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        )}
                        placeholder="cost, procedures, safety"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddExample(false)}
                    className={clsx(
                      'px-4 py-2 rounded-lg',
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExample}
                    className="px-4 py-2 bg-[#D35C2F] text-white rounded-lg hover:bg-[#B8491F]"
                  >
                    Add Example
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}