import React, { useState, useRef } from 'react';
import {
  Plus,
  FileText,
  Download,
  Calculator,
  Users,
  Target,
  CheckCircle,
  DollarSign,
  Home,
  AlertCircle,
  TrendingUp,
  Calendar,
  Award,
} from 'lucide-react';

const SalesDealBuilder = () => {
  const [currentDeal, setCurrentDeal] = useState({
    name: 'New Deal',
    meddpicc: {
      metrics: { score: '', notes: '' },
      economicBuyer: { score: '', notes: '' },
      decisionCriteria: { score: '', notes: '' },
      decisionProcess: { score: '', notes: '' },
      paperProcess: { score: '', notes: '' },
      identifyPain: { score: '', notes: '' },
      champion: { score: '', notes: '' },
      competition: { score: '', notes: '' },
    },
    champion: {
      name: '',
      role: '',
      influence: '',
      commitment: '',
      access: '',
      notes: '',
    },
    actionPlan: {
      items: [],
    },
    costJustification: {
      currentCosts: '',
      proposedSolution: '',
      savings: '',
      roi: '',
      timeline: '',
      notes: '',
    },
    nextSteps: [],
  });

  const [activeTab, setActiveTab] = useState('home');
  const [inputText, setInputText] = useState('');
  const [showAIHelper, setShowAIHelper] = useState(false);
  const fileInputRef = useRef();

  const meddpiccCategories = [
    { key: 'metrics', label: 'Metrics', icon: '📊' },
    { key: 'economicBuyer', label: 'Economic Buyer', icon: '💼' },
    { key: 'decisionCriteria', label: 'Decision Criteria', icon: '📋' },
    { key: 'decisionProcess', label: 'Decision Process', icon: '🔄' },
    { key: 'paperProcess', label: 'Paper Process', icon: '📄' },
    { key: 'identifyPain', label: 'Identify Pain', icon: '⚡' },
    { key: 'champion', label: 'Champion', icon: '🏆' },
    { key: 'competition', label: 'Competition', icon: '⚔️' },
  ];

  const updateMEDDPICC = (category, field, value) => {
    setCurrentDeal((prev) => ({
      ...prev,
      meddpicc: {
        ...prev.meddpicc,
        [category]: {
          ...prev.meddpicc[category],
          [field]: value,
        },
      },
    }));
  };

  const updateChampion = (field, value) => {
    setCurrentDeal((prev) => ({
      ...prev,
      champion: {
        ...prev.champion,
        [field]: value,
      },
    }));
  };

  const addActionItem = () => {
    setCurrentDeal((prev) => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        items: [
          ...prev.actionPlan.items,
          {
            id: Date.now(),
            task: '',
            owner: '',
            dueDate: '',
            status: 'pending',
          },
        ],
      },
    }));
  };

  const updateActionItem = (id, field, value) => {
    setCurrentDeal((prev) => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        items: prev.actionPlan.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const removeActionItem = (id) => {
    setCurrentDeal((prev) => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        items: prev.actionPlan.items.filter((item) => item.id !== id),
      },
    }));
  };

  const updateCostJustification = (field, value) => {
    setCurrentDeal((prev) => ({
      ...prev,
      costJustification: {
        ...prev.costJustification,
        [field]: value,
      },
    }));
  };

  const addNextStep = () => {
    setCurrentDeal((prev) => ({
      ...prev,
      nextSteps: [
        ...prev.nextSteps,
        {
          id: Date.now(),
          task: '',
          priority: 'medium',
          dueDate: '',
          completed: false,
        },
      ],
    }));
  };

  const updateNextStep = (id, field, value) => {
    setCurrentDeal((prev) => ({
      ...prev,
      nextSteps: prev.nextSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    }));
  };

  const removeNextStep = (id) => {
    setCurrentDeal((prev) => ({
      ...prev,
      nextSteps: prev.nextSteps.filter((step) => step.id !== id),
    }));
  };

  const getChampionScore = () => {
    const influence = parseInt(currentDeal.champion.influence) || 0;
    const commitment = parseInt(currentDeal.champion.commitment) || 0;
    return influence && commitment
      ? Math.round((influence + commitment) / 2)
      : 0;
  };

  const calculateMEDDPICCProgress = () => {
    const scores = Object.values(currentDeal.meddpicc)
      .map((item) => parseInt(item.score) || 0)
      .filter((score) => score > 0);

    return scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  };

  const getOverallHealthScore = () => {
    const meddpiccScore = calculateMEDDPICCProgress();
    const championScore = getChampionScore();
    const actionPlanScore =
      currentDeal.actionPlan.items.length > 0
        ? Math.round(
            (currentDeal.actionPlan.items.filter(
              (item) => item.status === 'completed'
            ).length /
              currentDeal.actionPlan.items.length) *
              100
          )
        : 0;

    return Math.round((meddpiccScore + championScore * 20 + actionPlanScore) / 3);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getUpcomingTasks = () => {
    const upcoming = [];

    currentDeal.nextSteps
      .filter((step) => !step.completed && step.dueDate)
      .forEach((step) => {
        upcoming.push({
          ...step,
          type: 'next-step',
          source: 'Next Steps',
        });
      });

    currentDeal.actionPlan.items
      .filter((item) => item.status !== 'completed' && item.dueDate)
      .forEach((item) => {
        upcoming.push({
          ...item,
          type: 'action-item',
          source: 'Action Plan',
        });
      });

    return upcoming
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getRiskFactors = () => {
    const risks = [];

    if (calculateMEDDPICCProgress() < 60) {
      risks.push('MEDDPICC scoring below 60%');
    }

    if (!currentDeal.champion.name) {
      risks.push('No champion identified');
    }

    if (getChampionScore() < 3) {
      risks.push('Champion influence/commitment low');
    }

    if (currentDeal.actionPlan.items.length === 0) {
      risks.push('No mutual action plan items');
    }

    const overdueTasks = getUpcomingTasks().filter(
      (task) => new Date(task.dueDate) < new Date()
    );
    if (overdueTasks.length > 0) {
      risks.push(`${overdueTasks.length} overdue task(s)`);
    }

    return risks;
  };

  const processInput = (text) => {
    const suggestions = [];

    if (
      text.toLowerCase().includes('problem') ||
      text.toLowerCase().includes('issue') ||
      text.toLowerCase().includes('challenge')
    ) {
      suggestions.push({
        category: 'identifyPain',
        suggestion: 'Pain point identified in text - consider scoring this section',
      });
    }

    if (
      text.toLowerCase().includes('ceo') ||
      text.toLowerCase().includes('cto') ||
      text.toLowerCase().includes('decision maker')
    ) {
      suggestions.push({
        category: 'economicBuyer',
        suggestion: 'Decision maker mentioned - update Economic Buyer section',
      });
    }

    if (
      text.toLowerCase().includes('timeline') ||
      text.toLowerCase().includes('deadline') ||
      text.toLowerCase().includes('by ')
    ) {
      suggestions.push({
        category: 'actionPlan',
        suggestion: 'Timeline mentioned - consider adding to Action Plan',
      });
    }

    return suggestions;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target.result);
        setShowAIHelper(true);
      };
      reader.readAsText(file);
    }
  };

  const exportDeal = () => {
    const dataStr = JSON.stringify(currentDeal, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDeal.name.replace(/\s+/g, '_')}_deal.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={currentDeal.name}
                onChange={(e) =>
                  setCurrentDeal((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-2xl font-bold border-none outline-none bg-transparent w-full"
                placeholder="Deal Name"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FileText size={16} />
                Upload File
              </button>
              <button
                onClick={exportDeal}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
          <div className="flex gap-1">
            {[
              { key: 'home', label: 'Home', icon: Home },
              { key: 'meddpicc', label: 'MEDDPICC', icon: Target },
              { key: 'champion', label: 'Champion', icon: Users },
              { key: 'actionPlan', label: 'Action Plan', icon: CheckCircle },
              { key: 'costJustification', label: 'Cost Justification', icon: DollarSign },
              { key: 'aiHelper', label: 'AI Helper', icon: Calculator },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'home' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Deal Dashboard</h2>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Overall Health</p>
                      <p className="text-2xl font-bold">
                        {getOverallHealthScore()}%
                      </p>
                    </div>
                    <TrendingUp size={24} className="text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">MEDDPICC Score</p>
                      <p className="text-2xl font-bold">
                        {calculateMEDDPICCProgress()}%
                      </p>
                    </div>
                    <Target size={24} className="text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Champion Score</p>
                      <p className="text-2xl font-bold">
                        {getChampionScore()}/5
                      </p>
                    </div>
                    <Award size={24} className="text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Action Items</p>
                      <p className="text-2xl font-bold">
                        {currentDeal.actionPlan.items.length}
                      </p>
                    </div>
                    <CheckCircle size={24} className="text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Next Steps Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Next Steps & Immediate Actions
                  </h3>
                  <button
                    onClick={addNextStep}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Plus size={14} />
                    Add Next Step
                  </button>
                </div>

                <div className="space-y-3">
                  {currentDeal.nextSteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={(e) =>
                          updateNextStep(step.id, 'completed', e.target.checked)
                        }
                        className="w-4 h-4"
                      />

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={step.task}
                          onChange={(e) =>
                            updateNextStep(step.id, 'task', e.target.value)
                          }
                          placeholder="What needs to be done?"
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />

                        <select
                          value={step.priority}
                          onChange={(e) =>
                            updateNextStep(step.id, 'priority', e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>

                        <input
                          type="date"
                          value={step.dueDate}
                          onChange={(e) =>
                            updateNextStep(step.id, 'dueDate', e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>

                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          step.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : step.priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : step.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {step.priority}
                      </div>

                      <button
                        onClick={() => removeNextStep(step.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {currentDeal.nextSteps.length === 0 && (
                    <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      No next steps defined. Add some to track immediate actions.
                    </div>
                  )}
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Tasks */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={20} className="text-blue-600" />
                    <h3 className="font-semibold">Upcoming Tasks</h3>
                  </div>

                  <div className="space-y-2">
                    {getUpcomingTasks().map((task) => (
                      <div
                        key={`${task.type}-${task.id}`}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {task.task || task.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {task.source}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}

                    {getUpcomingTasks().length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-3">
                        No upcoming tasks with due dates
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={20} className="text-red-600" />
                    <h3 className="font-semibold">Risk Factors</h3>
                  </div>

                  <div className="space-y-2">
                    {getRiskFactors().map((risk, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 bg-red-50 rounded"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div className="text-sm text-red-700">{risk}</div>
                      </div>
                    ))}

                    {getRiskFactors().length === 0 && (
                      <div className="text-sm text-green-600 text-center py-3">
                        ✓ No major risk factors identified
                      </div>
                    )}
                  </div>
                </div>

                {/* MEDDPICC Quick View */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">MEDDPICC Quick View</h3>

                  <div className="grid grid-cols-2 gap-2">
                    {meddpiccCategories.map((category) => {
                      const score =
                        parseInt(currentDeal.meddpicc[category.key].score) || 0;
                      return (
                        <div
                          key={category.key}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{category.icon}</span>
                            <span className="text-xs font-medium">
                              {category.label}
                            </span>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              score >= 4
                                ? 'bg-green-100 text-green-800'
                                : score >= 3
                                ? 'bg-yellow-100 text-yellow-800'
                                : score >= 1
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {score || '-'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Champion Quick View */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Champion Status</h3>

                  {currentDeal.champion.name ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Name:</span>
                        <span className="text-sm">
                          {currentDeal.champion.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Role:</span>
                        <span className="text-sm">
                          {currentDeal.champion.role || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Influence:</span>
                        <span
                          className={`text-sm px-2 py-1 rounded ${getHealthColor(
                            parseInt(currentDeal.champion.influence) * 20
                          )}`}
                        >
                          {currentDeal.champion.influence || 'Not scored'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Commitment:</span>
                        <span
                          className={`text-sm px-2 py-1 rounded ${getHealthColor(
                            parseInt(currentDeal.champion.commitment) * 20
                          )}`}
                        >
                          {currentDeal.champion.commitment || 'Not scored'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No champion identified yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'meddpicc' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">MEDDPICC Scoring</h2>
                <div className="text-sm text-gray-600">
                  Progress: {calculateMEDDPICCProgress()}%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meddpiccCategories.map((category) => (
                  <div key={category.key} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{category.icon}</span>
                      <h3 className="font-semibold">{category.label}</h3>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Score (1-5):
                      </label>
                      <select
                        value={currentDeal.meddpicc[category.key].score}
                        onChange={(e) =>
                          updateMEDDPICC(category.key, 'score', e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">-</option>
                        <option value="1">1 - Very Poor</option>
                        <option value="2">2 - Poor</option>
                        <option value="3">3 - Average</option>
                        <option value="4">4 - Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes:
                      </label>
                      <textarea
                        value={currentDeal.meddpicc[category.key].notes}
                        onChange={(e) =>
                          updateMEDDPICC(category.key, 'notes', e.target.value)
                        }
                        placeholder={`Notes for ${category.label}`}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'champion' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Champion Analysis</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Champion Name:
                  </label>
                  <input
                    type="text"
                    value={currentDeal.champion.name}
                    onChange={(e) => updateChampion('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter champion name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role/Title:
                  </label>
                  <input
                    type="text"
                    value={currentDeal.champion.role}
                    onChange={(e) => updateChampion('role', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter role/title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Influence Level (1-5):
                  </label>
                  <select
                    value={currentDeal.champion.influence}
                    onChange={(e) => updateChampion('influence', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select influence level</option>
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Below Average</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - High</option>
                    <option value="5">5 - Very High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commitment Level (1-5):
                  </label>
                  <select
                    value={currentDeal.champion.commitment}
                    onChange={(e) =>
                      updateChampion('commitment', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select commitment level</option>
                    <option value="1">1 - No Commitment</option>
                    <option value="2">2 - Weak Commitment</option>
                    <option value="3">3 - Moderate Commitment</option>
                    <option value="4">4 - Strong Commitment</option>
                    <option value="5">5 - Total Commitment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level:
                  </label>
                  <input
                    type="text"
                    value={currentDeal.champion.access}
                    onChange={(e) => updateChampion('access', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter access details"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes:
                  </label>
                  <textarea
                    value={currentDeal.champion.notes}
                    onChange={(e) => updateChampion('notes', e.target.value)}
                    placeholder="Additional notes about the champion"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actionPlan' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Action Plan</h2>
                <button
                  onClick={addActionItem}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Plus size={14} />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {currentDeal.actionPlan.items.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <input
                        type="text"
                        value={item.task}
                        onChange={(e) =>
                          updateActionItem(item.id, 'task', e.target.value)
                        }
                        placeholder="Task"
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="text"
                        value={item.owner}
                        onChange={(e) =>
                          updateActionItem(item.id, 'owner', e.target.value)
                        }
                        placeholder="Owner"
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="date"
                        value={item.dueDate}
                        onChange={(e) =>
                          updateActionItem(item.id, 'dueDate', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateActionItem(item.id, 'status', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <button
                      onClick={() => removeActionItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}

                {currentDeal.actionPlan.items.length === 0 && (
                  <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    No action plan items defined. Add some to track tasks.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'costJustification' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Cost Justification</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Costs:
                  </label>
                  <input
                    type="text"
                    value={currentDeal.costJustification.currentCosts}
                    onChange={(e) =>
                      updateCostJustification('currentCosts', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., $10,000/month"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Solution Cost:
                  </label>
                  <input
                    type="text"
                    value={currentDeal.costJustification.proposedSolution}
                    onChange={(e) =>
                      updateCostJustification('proposedSolution', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., $8,000/month"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Savings:
                  </label>
                  <input
                    type="text"
                    value={currentDeal.costJustification.savings}
                    onChange={(e) =>
                      updateCostJustification('savings', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., $2,000/month"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ROI (%):
                  </label>
                  <input
                    type="number"
                    value={currentDeal.costJustification.roi}
                    onChange={(e) =>
                      updateCostJustification('roi', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline:
                  </label>
                  <input
                    type="text"
                    value={currentDeal.costJustification.timeline}
                    onChange={(e) =>
                      updateCostJustification('timeline', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., 6 months to implement"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes:
                  </label>
                  <textarea
                    value={currentDeal.costJustification.notes}
                    onChange={(e) =>
                      updateCostJustification('notes', e.target.value)
                    }
                    placeholder="Additional cost justification details"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aiHelper' && (
            <div>
              <h2 className="text-xl font-bold mb-6">AI Helper</h2>

              <div className="mb-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste text or upload a file to get suggestions"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-40 resize-none"
                />
              </div>

              <button
                onClick={() => setShowAIHelper(!showAIHelper)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {showAIHelper ? 'Hide Suggestions' : 'Show Suggestions'}
              </button>

              {showAIHelper && (
                <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                  {processInput(inputText).length > 0 ? (
                    processInput(inputText).map((suggestion, index) => (
                      <div key={index} className="mb-3">
                        <p className="text-sm font-medium">
                          {suggestion.category}:
                        </p>
                        <p className="text-sm text-gray-700">
                          {suggestion.suggestion}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No suggestions based on the provided text.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDealBuilder;
