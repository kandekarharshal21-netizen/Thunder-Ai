import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { AuditLogEntry } from '../types/weather';
import { 
  UserCheck, ShieldAlert, Cpu, Database, 
  Clock, Lock, CheckCircle2, AlertTriangle, Key, Users
} from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await weatherApi.getAuditLogs();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const roles = [
    { name: "Citizen", count: 1420, permissions: "View dashboard, create saved geofences, receive push alerts" },
    { name: "Analyst", count: 34, permissions: "Citizen + historical replay backtesting, forecast verification, storm investigation" },
    { name: "Operator", count: 8, permissions: "Analyst + data connector controls, self-healing override, emergency alert dispatch" },
    { name: "Admin", count: 2, permissions: "Full system configuration, user role management, cryptographic key rotation, audit compliance" }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">ADMINISTRATION & OPERATIONAL AUDIT LOGS</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ISO-27001 AUDIT COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-based access control (RBAC), ingestion health governance, and tamper-evident operational dispatch history.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4" />
          <span>Security Status: Nominal</span>
        </div>
      </div>

      {/* Role-Based Access Control Summary */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-xs">
        <h3 className="font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
          <span>Active Role Access Matrix (RBAC)</span>
          <Users className="w-4 h-4 text-cyan-400" />
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r) => (
            <div key={r.name} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{r.name}</span>
                <span className="font-mono text-cyan-300 text-xs bg-slate-800 px-2 py-0.5 rounded">{r.count} users</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{r.permissions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Operational Audit Trail ({logs.length} entries)
          </h3>
          <span className="font-mono text-[10px] text-slate-400">Append-Only Immutable Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <th className="pb-2.5">Audit ID</th>
                <th className="pb-2.5">Timestamp (UTC)</th>
                <th className="pb-2.5">Actor (Role)</th>
                <th className="pb-2.5">Action Code</th>
                <th className="pb-2.5">Target Resource</th>
                <th className="pb-2.5">Audit Details</th>
                <th className="pb-2.5 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 text-cyan-400 font-bold">{log.id}</td>
                  <td className="py-2.5 text-slate-300">{log.timestamp.replace('T', ' ').substring(0, 19)}</td>
                  <td className="py-2.5 font-bold text-white">
                    {log.user_id} <span className="text-[10px] text-cyan-300 font-normal">({log.user_role})</span>
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300">{log.target_resource}</td>
                  <td className="py-2.5 text-slate-400 max-w-xs truncate">{log.details}</td>
                  <td className="py-2.5 text-right text-slate-500">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
