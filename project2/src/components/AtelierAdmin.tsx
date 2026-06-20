"use client";

import React, { useState } from 'react';
import { products, Product } from '../data/products';
import { useAdminStore, Order, Coupon } from '../store/useAdminStore';
import { motion, AnimatePresence } from 'framer-motion';

interface AtelierAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AtelierAdmin({ isOpen, onClose }: AtelierAdminProps) {
  const {
    inventory,
    orders,
    coupons,
    setStock,
    updateOrderStatus,
    toggleCouponStatus,
    addCoupon,
    getSalesAnalytics
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics' | 'coupons'>('inventory');
  
  // Coupon Form States
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed' | 'free_shipping'>('percentage');
  const [newValue, setNewValue] = useState(10);

  if (!isOpen) return null;

  const analytics = getSalesAnalytics();

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    addCoupon({
      code: newCode.toUpperCase().trim(),
      discountType: newType,
      value: newType === 'free_shipping' ? 0 : newValue,
      isActive: true
    });
    setNewCode('');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Sourced': return 'text-brand-cream border-brand-cream/30 bg-brand-cream/5';
      case 'Crafting': return 'text-brand-gold border-brand-gold/30 bg-brand-gold/5';
      case 'Dispatched': return 'text-brand-copper border-brand-copper/30 bg-brand-copper/5';
      case 'Delivered': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-50 backdrop-blur-[4px]"
          />

          {/* Console Overlay */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 120 }}
            className="fixed bottom-0 left-0 w-full h-[85vh] bg-[#070707] border-t border-brand-cream/15 z-50 shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Console Header */}
            <div className="flex justify-between items-center px-8 py-5 bg-[#050505] border-b border-brand-cream/5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse"></span>
                <span className="text-[9px] font-mono tracking-widest text-brand-cream uppercase">
                  ATELIER SYSTEM CONTROL CONSOLE v2.6
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="group flex items-center gap-2 text-brand-cream/60 hover:text-brand-cream bg-transparent border-none cursor-pointer focus:outline-none p-1"
              >
                <span className="text-[8px] font-sans uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Exit Control
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Tabs */}
            <div className="flex bg-[#030303] border-b border-brand-cream/5 px-8 text-[9px] font-sans font-semibold uppercase tracking-[0.25em]">
              {[
                { id: 'inventory', name: 'Inventory Registry' },
                { id: 'orders', name: 'Simulated Orders' },
                { id: 'analytics', name: 'Revenue Reports' },
                { id: 'coupons', name: 'Promotional Rules' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-6 border-b-2 relative focus:outline-none cursor-pointer border-none ${
                    activeTab === tab.id
                      ? 'text-brand-gold border-brand-copper bg-brand-cream/5'
                      : 'text-brand-cream/45 border-transparent hover:text-brand-cream bg-transparent'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Console Content Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin text-left">
              
              {/* 1. INVENTORY REGISTRY */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-light text-brand-cream">Stock Ledger</h3>
                    <span className="text-[8px] font-mono text-brand-cream/40 uppercase">Update active quantities inside package atelier</span>
                  </div>

                  <div className="border border-brand-cream/10 overflow-hidden bg-black text-[10px] font-sans">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#050505] border-b border-brand-cream/10 text-brand-copper/80 font-bold uppercase tracking-wider text-[8px] text-left">
                          <th className="p-4 w-2/5">Chocolate Specimen</th>
                          <th className="p-4 text-center">Unit Weight</th>
                          <th className="p-4 text-center">Sommelier Pricing</th>
                          <th className="p-4 text-center">Atelier Stock</th>
                          <th className="p-4 text-right">Adjustment Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-cream/5 text-brand-cream/80">
                        {products.map((product) => {
                          const stockCount = inventory[product.id] ?? 0;
                          return (
                            <tr key={product.id} className="hover:bg-brand-cream/[0.02] transition-colors">
                              <td className="p-4 flex gap-3 items-center">
                                <div className="w-10 h-10 bg-[#050505] border border-brand-cream/5 flex items-center justify-center p-1 overflow-hidden">
                                  <img src={product.image} className="max-h-full object-contain" alt="" />
                                </div>
                                <div>
                                  <p className="font-medium text-brand-cream">{product.title}</p>
                                  <p className="text-[7px] text-brand-cream/40 uppercase tracking-wider mt-0.5">{product.subtitle}</p>
                                </div>
                              </td>
                              <td className="p-4 text-center font-mono">{product.weight}</td>
                              <td className="p-4 text-center font-mono text-brand-gold">{product.price}</td>
                              <td className="p-4 text-center">
                                <span className={`font-mono border px-2 py-0.5 uppercase text-[8px] font-bold ${
                                  stockCount <= 0 
                                    ? 'border-brand-copper/40 text-brand-copper bg-brand-copper/5'
                                    : stockCount < 10 
                                      ? 'border-amber-500/40 text-amber-500 bg-amber-500/5'
                                      : 'border-brand-cream/10 text-brand-cream/70'
                                }`}>
                                  {stockCount <= 0 ? 'Depleted (0)' : `${stockCount} units`}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="inline-flex items-center border border-brand-cream/10 bg-[#050505]">
                                  <button
                                    onClick={() => setStock(product.id, stockCount - 1)}
                                    className="px-3 py-1.5 hover:bg-brand-cream/5 border-none cursor-pointer focus:outline-none text-brand-cream/50 hover:text-brand-cream"
                                  >
                                    —
                                  </button>
                                  <input
                                    type="number"
                                    value={stockCount}
                                    onChange={(e) => setStock(product.id, parseInt(e.target.value) || 0)}
                                    className="w-12 bg-transparent border-none text-center text-[9px] font-mono text-brand-cream focus:outline-none"
                                  />
                                  <button
                                    onClick={() => setStock(product.id, stockCount + 1)}
                                    className="px-3 py-1.5 hover:bg-brand-cream/5 border-none cursor-pointer focus:outline-none text-brand-cream/50 hover:text-brand-cream"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. SIMULATED ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-light text-brand-cream">Acquisition Registry</h3>
                    <span className="text-[8px] font-mono text-brand-cream/40 uppercase">Trace client transactions and update packing lifecycle</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="border border-dashed border-brand-cream/10 p-12 text-center text-brand-cream/30 uppercase tracking-widest font-sans text-[10px] space-y-2">
                      <p>No transactions recorded in active simulation session.</p>
                      <p className="text-[8px] text-brand-cream/15 font-light">Proceed to checkout and place an order to register logs.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-black border border-brand-cream/10 p-6 space-y-4 font-sans text-[10px]">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-cream/5 pb-4">
                            <div>
                              <span className="text-[8px] font-mono text-brand-copper/85 uppercase tracking-wider">Order Certificate</span>
                              <h4 className="font-mono text-xs text-brand-cream font-bold mt-1">{order.id}</h4>
                              <p className="text-[7px] text-brand-cream/45 mt-0.5">{new Date(order.date).toLocaleString()}</p>
                            </div>
                            
                            {/* Order Status selector */}
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 border text-[7px] font-mono font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                className="bg-[#050505] border border-brand-cream/10 text-[8px] font-mono text-brand-cream px-2.5 py-1 focus:outline-none focus:border-brand-copper"
                              >
                                <option value="Sourced">Sourced</option>
                                <option value="Crafting">Atelier Crafting</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Collector Details */}
                            <div>
                              <span className="text-[8px] font-bold text-brand-copper uppercase tracking-wider block mb-2">Collector Details</span>
                              <p className="font-medium text-brand-cream text-xs">{order.customerName}</p>
                              <p className="text-brand-cream/60 mt-0.5 font-mono">{order.customerEmail}</p>
                              <p className="text-brand-cream/60 mt-1">{order.address}</p>
                              <p className="text-brand-cream/60">{order.city} - {order.postalCode}</p>
                            </div>

                            {/* Acquired Items */}
                            <div className="md:col-span-2">
                              <span className="text-[8px] font-bold text-brand-copper uppercase tracking-wider block mb-2">Acquired Items</span>
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="border-b border-brand-cream/5 text-brand-cream/40 text-left text-[8px] uppercase tracking-wider">
                                    <th className="pb-1.5">Item Specimen</th>
                                    <th className="pb-1.5 text-center">Qty</th>
                                    <th className="pb-1.5 text-right">Unit Price</th>
                                    <th className="pb-1.5 text-right">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item, idx) => (
                                    <tr key={idx} className="text-brand-cream/85">
                                      <td className="py-2">{item.title}</td>
                                      <td className="py-2 text-center font-mono">{item.quantity}</td>
                                      <td className="py-2 text-right font-mono">{item.price}</td>
                                      <td className="py-2 text-right font-mono text-brand-gold">
                                        ₹{(parseInt(item.price.replace(/[^0-9]/g, ''), 10) * item.quantity).toLocaleString('en-IN')}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="border-t border-brand-cream/5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[9px] text-brand-cream/55">
                            <div>
                              <span>Payment Protocol: </span>
                              <span className="font-mono text-brand-cream uppercase font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex gap-4 text-right ml-auto">
                              <span>Sub: ₹{order.subtotal.toLocaleString('en-IN')}</span>
                              <span>Tax: ₹{order.tax.toLocaleString('en-IN')}</span>
                              <span>Ship: {order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                              <span className="font-bold text-brand-gold text-xs">Total: ₹{order.total.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. REVENUE REPORTS */}
              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-light text-brand-cream">Sales Performance</h3>
                    <span className="text-[8px] font-mono text-brand-cream/40 uppercase">Atelier financial metrics</span>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                    <div className="bg-black border border-brand-cream/10 p-5 space-y-1">
                      <span className="text-[8px] uppercase tracking-wider text-brand-cream/45 font-medium">Total Atelier Revenue</span>
                      <p className="text-2xl font-serif text-brand-gold font-light">₹{analytics.totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-black border border-brand-cream/10 p-5 space-y-1">
                      <span className="text-[8px] uppercase tracking-wider text-brand-cream/45 font-medium">Transactions Certified</span>
                      <p className="text-2xl font-serif text-brand-cream font-light">{analytics.totalOrders}</p>
                    </div>
                    <div className="bg-black border border-brand-cream/10 p-5 space-y-1">
                      <span className="text-[8px] uppercase tracking-wider text-brand-cream/45 font-medium">Average Order Value</span>
                      <p className="text-2xl font-serif text-brand-cream font-light">
                        ₹{analytics.totalOrders > 0 ? Math.round(analytics.totalRevenue / analytics.totalOrders).toLocaleString('en-IN') : 0}
                      </p>
                    </div>
                    <div className="bg-black border border-brand-cream/10 p-5 space-y-1">
                      <span className="text-[8px] uppercase tracking-wider text-brand-cream/45 font-medium">Acquisition Target Status</span>
                      <p className="text-2xl font-serif text-brand-copper font-light">100% SECURE</p>
                    </div>
                  </div>

                  {/* SVG/Pure CSS charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    
                    {/* Sales by Category chart */}
                    <div className="bg-black border border-brand-cream/10 p-6 space-y-6">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-brand-copper block">Sourced Items by Category</span>
                      
                      <div className="space-y-4 font-sans text-[10px]">
                        {Object.entries(analytics.categorySales).map(([category, count]) => {
                          const maxCount = Math.max(...Object.values(analytics.categorySales), 1);
                          const percentage = (count / maxCount) * 100;
                          return (
                            <div key={category} className="space-y-1.5">
                              <div className="flex justify-between text-brand-cream/75">
                                <span>{category}</span>
                                <span className="font-mono text-brand-gold font-medium">{count} unit{count !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="w-full h-2 bg-[#080808] border border-brand-cream/5 rounded-none overflow-hidden">
                                <div
                                  className="h-full bg-brand-copper transition-all duration-1000"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Operational logs console */}
                    <div className="bg-black border border-brand-cream/10 p-6 space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-brand-copper block">System Operations Log</span>
                        <div className="font-mono text-[8px] text-brand-cream/40 space-y-2 leading-relaxed h-[160px] overflow-y-auto scrollbar-thin">
                          <p className="text-emerald-400/70">[OK] Session persistent DB online.</p>
                          <p className="text-brand-cream/45">[INFO] Loaded {products.length} catalog references from memory.</p>
                          <p className="text-brand-cream/45">[SYSTEM] Syncing with Auroville Atelier packaging log...</p>
                          {orders.map((o, idx) => (
                            <p key={idx} className="text-brand-gold/70">
                              [TRANSACTION] order {o.id} registered for amount ₹{o.total.toLocaleString()} - Status: {o.status}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="text-[8px] text-brand-cream/30 border-t border-brand-cream/5 pt-4">
                        * All logs reside client-side to optimize luxury micro-batch transaction latency.
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 4. PROMOTIONAL RULES */}
              {activeTab === 'coupons' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Left: Active coupons ledger */}
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="font-serif text-lg font-light text-brand-cream">Promotional Codes</h3>
                    
                    <div className="border border-brand-cream/10 overflow-hidden bg-black text-[10px] font-sans">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#050505] border-b border-brand-cream/10 text-brand-copper/80 font-bold uppercase tracking-wider text-[8px] text-left">
                            <th className="p-4">Coupon Code</th>
                            <th className="p-4 text-center">Discount Logic</th>
                            <th className="p-4 text-center">Promotion Value</th>
                            <th className="p-4 text-center">Active Status</th>
                            <th className="p-4 text-right">Action Toggle</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-cream/5 text-brand-cream/80">
                          {coupons.map((coupon) => (
                            <tr key={coupon.code} className="hover:bg-brand-cream/[0.02] transition-colors">
                              <td className="p-4 font-mono font-bold text-brand-cream">{coupon.code}</td>
                              <td className="p-4 text-center capitalize">{coupon.discountType.replace('_', ' ')}</td>
                              <td className="p-4 text-center font-mono text-brand-gold">
                                {coupon.discountType === 'percentage' 
                                  ? `${coupon.value}%` 
                                  : coupon.discountType === 'fixed' 
                                    ? `₹${coupon.value}` 
                                    : 'Free Ship'}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`font-mono border px-2 py-0.5 text-[8px] uppercase tracking-wider font-bold ${
                                  coupon.isActive 
                                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' 
                                    : 'border-brand-cream/10 text-brand-cream/20'
                                }`}>
                                  {coupon.isActive ? 'Active' : 'Disabled'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => toggleCouponStatus(coupon.code)}
                                  className={`px-3 py-1 text-[8px] font-sans uppercase tracking-widest border transition-all cursor-pointer focus:outline-none ${
                                    coupon.isActive
                                      ? 'bg-transparent border-brand-copper/40 text-brand-copper hover:bg-brand-copper hover:text-brand-black'
                                      : 'bg-brand-cream border-brand-cream text-brand-black hover:bg-brand-gold hover:border-brand-gold'
                                  }`}
                                >
                                  {coupon.isActive ? 'Disable' : 'Enable'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Add new coupon form */}
                  <div className="lg:col-span-5 bg-black border border-brand-cream/10 p-6 space-y-6">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-brand-copper block">Deploy Promotional Rule</span>
                    
                    <form onSubmit={handleAddCoupon} className="space-y-4 text-[10px] font-sans font-light">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wider text-brand-cream/50">Promotion Code</label>
                        <input
                          type="text"
                          required
                          value={newCode}
                          onChange={(e) => setNewCode(e.target.value)}
                          className="w-full bg-[#080808] border border-brand-cream/10 px-3 py-2 text-brand-cream focus:outline-none focus:border-brand-copper font-mono uppercase"
                          placeholder="e.g. MONSOON30"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wider text-brand-cream/50">Discount Mechanism</label>
                        <select
                          value={newType}
                          onChange={(e) => setNewType(e.target.value as any)}
                          className="w-full bg-[#080808] border border-brand-cream/10 px-3 py-2 text-brand-cream focus:outline-none focus:border-brand-copper"
                        >
                          <option value="percentage">Percentage (e.g. 20% off)</option>
                          <option value="fixed">Fixed Flat Reduction (e.g. ₹500 off)</option>
                          <option value="free_shipping">Free Shipping</option>
                        </select>
                      </div>

                      {newType !== 'free_shipping' && (
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-wider text-brand-cream/50">Rule Discount Value</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={newValue}
                            onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
                            className="w-full bg-[#080808] border border-brand-cream/10 px-3 py-2 text-brand-cream focus:outline-none focus:border-brand-copper font-mono"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3.5 text-[8px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-black bg-brand-copper hover:bg-brand-gold transition-colors duration-500 border-none cursor-pointer focus:outline-none"
                      >
                        Deploy Promotional Code
                      </button>
                    </form>
                  </div>

                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
