'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  GiftIcon, 
  TrophyIcon, 
  StarIcon, 
  SparklesIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  TicketIcon,
  HeartIcon,
  FireIcon,
  BoltIcon,
  TrophyIcon as CrownIcon,
  SparklesIcon as DiamondIcon
} from '@heroicons/react/24/outline'
import { 
  GiftIcon as GiftSolid,
  TrophyIcon as TrophySolid,
  StarIcon as StarSolid,
  HeartIcon as HeartSolid,
  FireIcon as FireSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

const loyaltyData = {
  currentPoints: 2847,
  totalEarned: 5420,
  totalRedeemed: 2573,
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 1153,
  memberSince: '2024-01-15'
}

const tiers = [
  { name: 'Bronze', min: 0, max: 999, color: 'from-amber-600 to-orange-600', icon: StarIcon },
  { name: 'Silver', min: 1000, max: 2499, color: 'from-slate-400 to-slate-600', icon: TrophyIcon },
  { name: 'Gold', min: 2500, max: 4999, color: 'from-yellow-400 to-yellow-600', icon: CrownIcon },
  { name: 'Platinum', min: 5000, max: 9999, color: 'from-purple-400 to-purple-600', icon: DiamondIcon },
  { name: 'Diamond', min: 10000, max: Infinity, color: 'from-blue-400 to-cyan-600', icon: SparklesIcon }
]

const recentActivity = [
  {
    id: 1,
    type: 'earned',
    points: 150,
    description: 'Booking confirmation bonus',
    date: '2024-03-10',
    icon: GiftSolid,
    iconColor: 'text-green-500'
  },
  {
    id: 2,
    type: 'earned',
    points: 300,
    description: 'Treatment completion - Teeth Whitening',
    date: '2024-03-08',
    icon: HeartSolid,
    iconColor: 'text-pink-500'
  },
  {
    id: 3,
    type: 'redeemed',
    points: -200,
    description: 'Hotel upgrade discount',
    date: '2024-03-05',
    icon: TicketIcon,
    iconColor: 'text-blue-500'
  },
  {
    id: 4,
    type: 'earned',
    points: 75,
    description: 'Review submission bonus',
    date: '2024-03-03',
    icon: StarSolid,
    iconColor: 'text-yellow-500'
  },
  {
    id: 5,
    type: 'earned',
    points: 500,
    description: 'Referral bonus - Friend signup',
    date: '2024-03-01',
    icon: FireSolid,
    iconColor: 'text-orange-500'
  }
]

const rewards = [
  {
    id: 1,
    title: '10% Treatment Discount',
    description: 'Save on your next dental procedure',
    points: 500,
    category: 'Treatment',
    gradient: 'from-green-500 to-emerald-600',
    icon: HeartIcon,
    popular: true
  },
  {
    id: 2,
    title: 'Hotel Upgrade',
    description: 'Complimentary room upgrade at partner hotels',
    points: 750,
    category: 'Accommodation',
    gradient: 'from-blue-500 to-cyan-600',
    icon: ShoppingBagIcon
  },
  {
    id: 3,
    title: 'Airport Lounge Access',
    description: 'Premium lounge access for your travel',
    points: 300,
    category: 'Travel',
    gradient: 'from-purple-500 to-pink-600',
    icon: TicketIcon
  },
  {
    id: 4,
    title: 'Free Consultation',
    description: 'Complimentary dental consultation',
    points: 1000,
    category: 'Treatment',
    gradient: 'from-orange-500 to-red-600',
    icon: GiftIcon,
    featured: true
  },
  {
    id: 5,
    title: 'Spa Treatment',
    description: 'Relaxing spa session at partner locations',
    points: 600,
    category: 'Wellness',
    gradient: 'from-pink-500 to-rose-600',
    icon: SparklesIcon
  },
  {
    id: 6,
    title: 'Travel Insurance',
    description: 'Comprehensive travel insurance coverage',
    points: 400,
    category: 'Travel',
    gradient: 'from-indigo-500 to-blue-600',
    icon: CreditCardIcon
  }
]

const achievements = [
  {
    id: 1,
    title: 'First Booking',
    description: 'Completed your first treatment booking',
    points: 100,
    unlocked: true,
    icon: StarSolid,
    color: 'text-yellow-500'
  },
  {
    id: 2,
    title: 'Review Master',
    description: 'Left 5 helpful reviews',
    points: 250,
    unlocked: true,
    icon: HeartSolid,
    color: 'text-pink-500'
  },
  {
    id: 3,
    title: 'Referral Champion',
    description: 'Referred 3 friends successfully',
    points: 500,
    unlocked: true,
    icon: FireSolid,
    color: 'text-orange-500'
  },
  {
    id: 4,
    title: 'Treatment Veteran',
    description: 'Completed 10 treatments',
    points: 1000,
    unlocked: false,
    progress: 3,
    total: 10,
    icon: TrophySolid,
    color: 'text-blue-500'
  },
  {
    id: 5,
    title: 'Global Explorer',
    description: 'Visited 5 different countries for treatment',
    points: 1500,
    unlocked: false,
    progress: 1,
    total: 5,
    icon: SparklesIcon,
    color: 'text-purple-500'
  }
]

export default function LoyaltyPointsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const currentTier = tiers.find(tier => 
    loyaltyData.currentPoints >= tier.min && loyaltyData.currentPoints <= tier.max
  )
  
  const nextTier = tiers.find(tier => tier.name === loyaltyData.nextTier)
  
  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category.toLowerCase() === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#DB3116] via-red-600 to-orange-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GiftSolid className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Loyalty Rewards</h1>
              <p className="text-white/80">Earn points, unlock rewards, enjoy premium benefits</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <TrophySolid className="h-6 w-6 text-white" />
                <div>
                  <p className="text-sm text-white/80">Current Points</p>
                  <p className="font-bold text-xl">{loyaltyData.currentPoints.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CrownIcon className="h-6 w-6 text-white" />
                <div>
                  <p className="text-sm text-white/80">Current Tier</p>
                  <p className="font-bold text-xl">{loyaltyData.tier}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BoltIcon className="h-6 w-6 text-white" />
                <div>
                  <p className="text-sm text-white/80">To Next Tier</p>
                  <p className="font-bold text-xl">{loyaltyData.pointsToNextTier}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <StarSolid className="h-6 w-6 text-white" />
                <div>
                  <p className="text-sm text-white/80">Total Earned</p>
                  <p className="font-bold text-xl">{loyaltyData.totalEarned.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tier Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Membership Tier Progress</h2>
        
        <div className="space-y-6">
          {/* Current Tier Card */}
          {currentTier && (
            <div className={clsx(
              "p-6 rounded-xl bg-gradient-to-r text-white shadow-lg",
              currentTier.color
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <currentTier.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{currentTier.name} Member</h3>
                    <p className="text-white/80">Current tier since {new Date(loyaltyData.memberSince).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{loyaltyData.currentPoints.toLocaleString()}</div>
                  <div className="text-sm text-white/80">points</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Progress to Next Tier */}
          {nextTier && (
            <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Progress to {nextTier.name}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {loyaltyData.pointsToNextTier} points needed
                </span>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 mb-4">
                <div 
                  className={clsx("h-3 rounded-full bg-gradient-to-r transition-all duration-1000", nextTier.color)}
                  style={{ 
                    width: `${((loyaltyData.currentPoints - (currentTier?.min || 0)) / (nextTier.min - (currentTier?.min || 0))) * 100}%` 
                  }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{currentTier?.name} ({currentTier?.min})</span>
                <span>{nextTier.name} ({nextTier.min})</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Rewards */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Available Rewards</h2>
              
              {/* Category Filter */}
              <div className="flex gap-2">
                {['all', 'treatment', 'travel', 'accommodation', 'wellness'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={clsx(
                      "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 capitalize",
                      selectedCategory === category
                        ? "bg-[#DB3116] text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 group"
                >
                  {reward.popular && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}
                  
                  {reward.featured && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className={clsx(
                      "h-12 w-12 rounded-xl bg-gradient-to-r flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                      reward.gradient
                    )}>
                      <reward.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {reward.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        {reward.description}
                      </p>
                      <span className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                        {reward.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {reward.points.toLocaleString()}
                      <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                        points
                      </span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loyaltyData.currentPoints < reward.points}
                      className={clsx(
                        "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                        loyaltyData.currentPoints >= reward.points
                          ? "bg-gradient-to-r from-[#DB3116] to-red-600 text-white shadow-lg hover:shadow-xl"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      )}
                    >
                      {loyaltyData.currentPoints >= reward.points ? 'Redeem' : 'Not enough points'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={clsx(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    activity.type === 'earned' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  )}>
                    <activity.icon className={clsx("h-4 w-4", activity.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.type === 'earned' ? '+' : ''}{activity.points} points
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Achievements</h3>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={clsx(
                    "p-3 rounded-lg border transition-all duration-300",
                    achievement.unlocked 
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                      achievement.unlocked ? 'bg-green-100 dark:bg-green-900/20' : 'bg-slate-200 dark:bg-slate-700'
                    )}>
                      <achievement.icon className={clsx(
                        "h-4 w-4",
                        achievement.unlocked ? achievement.color : 'text-slate-400 dark:text-slate-500'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={clsx(
                        "text-sm font-medium",
                        achievement.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                      )}>
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {achievement.description}
                      </p>
                      {achievement.unlocked ? (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          +{achievement.points} points earned
                        </span>
                      ) : achievement.progress !== undefined ? (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                            <span>{achievement.progress}/{achievement.total}</span>
                            <span>{achievement.points} points</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1">
                            <div 
                              className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                              style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {achievement.points} points available
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}