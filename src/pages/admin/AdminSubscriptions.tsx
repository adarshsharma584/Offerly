import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Search, CheckCircle2, XCircle, Clock, DollarSign, Calendar, TrendingUp, Download, Eye } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock subscription data
const mockSubscriptions = [
  {
    id: '1',
    merchantName: 'Style Salon',
    plan: 'Premium',
    price: 2999,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    autoRenew: true,
    invoices: 3,
  },
  {
    id: '2',
    merchantName: 'Fitness Hub',
    plan: 'Enterprise',
    price: 4999,
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    autoRenew: true,
    invoices: 2,
  },
  {
    id: '3',
    merchantName: 'Spice Garden',
    plan: 'Basic',
    price: 999,
    status: 'expired',
    startDate: '2023-12-01',
    endDate: '2024-03-01',
    autoRenew: false,
    invoices: 3,
  },
  {
    id: '4',
    merchantName: 'Tech Store',
    plan: 'Premium',
    price: 2999,
    status: 'pending',
    startDate: '2024-03-20',
    endDate: '2024-06-20',