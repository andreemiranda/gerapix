import { useState, useEffect, FormEvent } from 'react';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestoreErrorHandler';
import { PixConfig, PixKeyType, OperationType } from '../types';
import { doc, setDoc, collection, getDocs, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { usePixConfig } from '../context/PixConfigContext';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { motion } from 'motion/react';
import { Settings, Users, Save, Trash2, CheckCircle, Mail, UserCheck, AlertCircle, Clock, Search } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboard() {
  const { config: remoteConfig } = usePixConfig();
  const { admins, count: countAdmins, removeAdmin: apiRemoveAdmin } = useAdminUsers();
  
  const [config, setConfig] = useState<PixConfig>({
    tipo_chave: 'aleatoria',
    chave_pix: '',
    identificador: 'GERAPIX',
    merchant_name: 'LOJA TESTE',
    merchant_city: 'SAO PAULO'
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  
  // New Admin form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminName, setNewAdminName] = useState('');

  useEffect(() => {
    if (remoteConfig && !isInitialized) {
      setConfig(remoteConfig);
      setIsInitialized(true);
    }
  }, [remoteConfig, isInitialized]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const txSnap = await getDocs(query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(20)));
        setTransactions(txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching admin data:", err);
        handleFirestoreError(err, OperationType.GET, 'admin/dashboard-data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveConfig = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    // Simple validation (Bug #2 improvement)
    if (!config.chave_pix.trim()) {
      setMessage({ type: 'error', text: 'Chave PIX é obrigatória.' });
      setSaving(false);
      return;
    }

    try {
      await setDoc(doc(db, 'config', 'settings'), {
        ...config,
        updatedAt: serverTimestamp()
      });
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
      setIsInitialized(false); // Enable one-time re-sync from server source of truth
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: `Erro: ${err.message || 'Sem permissão'}` });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (countAdmins >= 3) {
      setMessage({ type: 'error', text: 'Limite de 3 administradores atingido.' });
      return;
    }

    if (!newAdminEmail || !newAdminPass || !newAdminName) {
      setMessage({ type: 'error', text: 'Preencha todos os campos do novo administrador.' });
      return;
    }

    setSaving(true);
    try {
      // Logic: Invitations collection (workaround for Auth limitations in frontend)
      await setDoc(doc(db, 'admins_invitations', newAdminEmail.toLowerCase()), {
        email: newAdminEmail.toLowerCase(),
        username: newAdminName,
        role: 'admin',
        createdAt: serverTimestamp()
      });

      setMessage({ type: 'success', text: 'Convite enviado! O usuário deve fazer login com este e-mail.' });
      setNewAdminEmail('');
      setNewAdminPass('');
      setNewAdminName('');
    } catch (err: unknown) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erro ao adicionar administrador.' });
    } finally {
      setSaving(false);
    }
  };

  const removeAdmin = async (uid: string) => {
    if (uid === auth.currentUser?.uid) return;
    try {
      await apiRemoveAdmin(uid);
    } catch (err: unknown) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erro ao remover administrador.' });
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-pix-purple border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="flex-1 w-full flex flex-col space-y-6 px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0 px-2 lg:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel Administrativo</h1>
          <p className="text-slate-500 text-sm">Gerencie as configurações do seu sistema PIX</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-pix-purple/10 text-pix-purple rounded-full text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto">
          <UserCheck className="w-3.5 h-3.5" />
          {countAdmins} / 3 Admins
        </div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-3 mx-2 lg:mx-0 rounded-xl flex items-center gap-3 border shadow-sm shrink-0",
            message.type === 'success' ? "bg-pix-green/10 border-pix-green/20 text-pix-green" : 
            message.type === 'error' ? "bg-red-50 border-red-100 text-red-600" :
            "bg-blue-50 border-blue-100 text-blue-600"
          )}
        >
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <p className="font-semibold text-xs">{message.text}</p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 flex-1 px-2 lg:px-0 pb-12">
        {/* PIX Settings */}
        <div className="lg:col-span-2 space-y-6">
          <section className="pix-card">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-pix-purple" />
              <h2 className="font-bold text-slate-800">Configuração das Chaves PIX (Recebedor)</h2>
            </div>
            <form onSubmit={handleSaveConfig} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tipo de Chave</label>
                  <select 
                    value={config.tipo_chave}
                    onChange={(e) => setConfig({ ...config, tipo_chave: e.target.value as PixKeyType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-pix-purple/20 focus:border-pix-purple outline-none transition-all"
                  >
                    <option value="cpf_cnpj">CPF/CNPJ</option>
                    <option value="email">E-mail</option>
                    <option value="telefone">Telefone</option>
                    <option value="aleatoria">Chave Aleatória</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Chave PIX</label>
                  <input 
                    type="text"
                    placeholder={
                      config.tipo_chave === 'email' ? 'exemplo@email.com' :
                      config.tipo_chave === 'telefone' ? '+55 (XX) XXXXX-XXXX' :
                      'Insira sua chave correspondente'
                    }
                    value={config.chave_pix}
                    onChange={(e) => setConfig({ ...config, chave_pix: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-pix-purple/20 focus:border-pix-purple outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Identificador (TXID)</label>
                  <input 
                    type="text"
                    maxLength={25}
                    value={config.identificador}
                    onChange={(e) => setConfig({ ...config, identificador: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-pix-purple/20 focus:border-pix-purple outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Cidade do Recebedor (PIX)</label>
                  <input 
                    type="text"
                    maxLength={15}
                    value={config.merchant_city}
                    onChange={(e) => setConfig({ ...config, merchant_city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-pix-purple/20 focus:border-pix-purple outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-pix-purple" />
                  <h3 className="text-sm font-bold text-slate-800">Identidade do Estabelecimento (Visual)</h3>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nome da Loja (Exibição no App)</label>
                  <input 
                    type="text"
                    maxLength={25}
                    value={config.merchant_name}
                    onChange={(e) => setConfig({ ...config, merchant_name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-pix-purple/20 focus:border-pix-purple outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-pix-purple/10 text-pix-purple border border-pix-purple/10 hover:bg-pix-purple hover:text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-pix-purple/5 disabled:opacity-50 active:scale-95"
              >
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
                Salvar Todas as Configurações
              </button>
            </form>
          </section>

          {/* Transaction History Improvement #3 */}
          <section className="pix-card">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-pix-purple" />
                <h2 className="font-bold text-slate-800">Últimas Transações</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">Log 20 itens</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Data/Hora</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">ID</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-400 text-xs italic">Nenhuma transação registrada</td>
                    </tr>
                  ) : (
                    transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-[11px] text-slate-600 font-medium">
                          {tx.timestamp?.toDate().toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-slate-500 uppercase">
                          {tx.identificador}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-800 text-right">
                          R$ {tx.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* User Management */}
        <div className="space-y-6">
          <section className="pix-card">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-pix-purple" />
              <h2 className="font-bold text-slate-800">Convidar Admin</h2>
            </div>
            <form onSubmit={handleAddAdmin} className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="email"
                    placeholder="E-mail do administrador"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-pix-purple focus:ring-1 focus:ring-pix-purple/10"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nome</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Nome de exibição"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-pix-purple focus:ring-1 focus:ring-pix-purple/10"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving || countAdmins >= 3}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
              >
                Enviar Convite
              </button>
            </form>
          </section>

          <section className="pix-card">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-pix-purple" />
              <h2 className="font-bold text-slate-800">Equipe Ativa</h2>
            </div>
            <div className="p-3 space-y-3">
              {admins.map(admin => (
                <div key={admin.uid} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-xs truncate">{admin.username}</p>
                    <p className="text-[10px] text-slate-500 truncate">{admin.email}</p>
                  </div>
                  {admin.uid !== auth.currentUser?.uid && (
                    <button 
                      onClick={() => removeAdmin(admin.uid)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
