import { useState, useEffect, FormEvent } from 'react';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestoreErrorHandler';
import { PixConfig, PixKeyType, OperationType } from '../types';
import {
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { usePixConfig } from '../context/PixConfigContext';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Users,
  Save,
  Trash2,
  CheckCircle,
  Mail,
  UserCheck,
  AlertCircle,
  Clock,
  Search,
  History,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'config' | 'transactions' | 'team';

export default function AdminDashboard() {
  const { config: remoteConfig } = usePixConfig();
  const { admins, count: countAdmins, removeAdmin: apiRemoveAdmin } = useAdminUsers();

  const [activeTab, setActiveTab] = useState<TabType>('config');
  const [config, setConfig] = useState<PixConfig>({
    tipo_chave: 'aleatoria',
    chave_pix: '',
    identificador: 'GERAPIX',
    merchant_name: 'LOJA TESTE',
    merchant_city: 'SAO PAULO',
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // New Admin form
  const [newAdminEmail, setNewAdminEmail] = useState('');
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
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const txSnap = await getDocs(
          query(
            collection(db, 'transactions'),
            orderBy('timestamp', 'desc'),
            where('timestamp', '>=', Timestamp.fromDate(sixtyDaysAgo))
          )
        );
        setTransactions(txSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching admin data:', err);
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

    if (!config.chave_pix.trim()) {
      setMessage({ type: 'error', text: 'Chave PIX é obrigatória.' });
      setSaving(false);
      return;
    }

    try {
      await setDoc(doc(db, 'config', 'settings'), {
        ...config,
        updatedAt: serverTimestamp(),
      });
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
      setIsInitialized(false);
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

    if (!newAdminEmail || !newAdminName) {
      setMessage({ type: 'error', text: 'Preencha todos os campos do novo administrador.' });
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'admins_invitations', newAdminEmail.toLowerCase()), {
        email: newAdminEmail.toLowerCase(),
        username: newAdminName,
        role: 'admin',
        createdAt: serverTimestamp(),
      });

      setMessage({
        type: 'success',
        text: 'Convite enviado! O usuário deve fazer login com este e-mail.',
      });
      setNewAdminEmail('');
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
      setMessage({ type: 'success', text: 'Administrador removido com sucesso.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: unknown) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erro ao remover administrador.' });
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--color-pix-purple)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 lg:px-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
              Painel Administrativo
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] text-[13px]">
            Configurações da sua plataforma de pagamentos GeraPix
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-2)] text-[var(--color-pix-purple)] rounded-full text-[13px] font-bold self-start">
          <UserCheck className="w-4 h-4" />
          {countAdmins} / 3 Administradores
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-1 p-1 bg-[var(--surface-2)] rounded-[var(--radius-md)] w-fit mx-2 lg:mx-0">
        <button
          onClick={() => setActiveTab('config')}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-sm)] text-[13px] font-bold transition-all',
            activeTab === 'config'
              ? 'bg-white text-[var(--color-pix-purple)] shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          )}
        >
          <Settings className="w-4 h-4" />
          Configurações
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-sm)] text-[13px] font-bold transition-all',
            activeTab === 'transactions'
              ? 'bg-white text-[var(--color-pix-purple)] shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          )}
        >
          <History className="w-4 h-4" />
          Transações
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-sm)] text-[13px] font-bold transition-all',
            activeTab === 'team'
              ? 'bg-white text-[var(--color-pix-purple)] shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          )}
        >
          <Users className="w-4 h-4" />
          Equipe
        </button>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              'toast mx-2 lg:mx-0',
              message.type === 'success'
                ? 'border-l-[var(--color-success)] text-[var(--color-success)]'
                : message.type === 'error'
                  ? 'border-l-[var(--color-error)] text-[var(--color-error)]'
                  : 'border-l-[var(--color-info)] text-[var(--color-info)]'
            )}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="font-bold text-[13px]">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 px-2 lg:px-0">
        {activeTab === 'config' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="card">
              <div className="card-accent" />
              <div className="p-8 space-y-8">
                <div>
                  <h2 className="section-title">Dados do Recebedor</h2>
                  <form onSubmit={handleSaveConfig} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="tipo_chave" className="label-sm">
                          Tipo de Chave PIX
                        </label>
                        <select
                          id="tipo_chave"
                          value={config.tipo_chave}
                          onChange={(e) =>
                            setConfig({ ...config, tipo_chave: e.target.value as PixKeyType })
                          }
                          className="field"
                        >
                          <option value="cpf_cnpj">CPF ou CNPJ</option>
                          <option value="email">E-mail</option>
                          <option value="telefone">Telefone</option>
                          <option value="aleatoria">Chave Aleatória</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="chave_pix" className="label-sm">
                          Chave PIX
                        </label>
                        <input
                          id="chave_pix"
                          type="text"
                          placeholder={
                            config.tipo_chave === 'email'
                              ? 'exemplo@email.com'
                              : config.tipo_chave === 'telefone'
                                ? '+55 (XX) XXXXX-XXXX'
                                : 'Sua chave PIX'
                          }
                          value={config.chave_pix}
                          onChange={(e) => setConfig({ ...config, chave_pix: e.target.value })}
                          required
                          className="field"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="identificador" className="label-sm">
                          Identificador (TXID)
                        </label>
                        <input
                          id="identificador"
                          type="text"
                          maxLength={25}
                          value={config.identificador}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              identificador: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                            })
                          }
                          className="field uppercase"
                          placeholder="EX: GERAPIX01"
                        />
                        <p className="helper-text">
                          Identificador opcional da transação (Apenas letras e números)
                        </p>
                      </div>
                      <div>
                        <label htmlFor="merchant_city" className="label-sm">
                          Cidade do Recebedor
                        </label>
                        <input
                          id="merchant_city"
                          type="text"
                          maxLength={15}
                          value={config.merchant_city}
                          onChange={(e) =>
                            setConfig({ ...config, merchant_city: e.target.value.toUpperCase() })
                          }
                          className="field uppercase"
                          placeholder="EX: SAO PAULO"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--surface-border)]">
                      <div className="mb-6">
                        <h3 className="section-title">Identidade Visual</h3>
                        <p className="text-[13px] text-[var(--text-secondary)] -mt-4 mb-4">
                          Como seu estabelecimento aparecerá para os clientes.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <label htmlFor="merchant_name" className="label-sm mb-0">
                            Nome do Estabelecimento
                          </label>
                          <span
                            className={cn(
                              'text-[11px] font-bold transition-colors',
                              (config.merchant_name?.length || 0) >= 30
                                ? 'text-[var(--color-error)]'
                                : (config.merchant_name?.length || 0) >= 28
                                  ? 'text-[var(--color-warning)]'
                                  : 'text-[var(--text-tertiary)]'
                            )}
                          >
                            {config.merchant_name?.length || 0}/30
                          </span>
                        </div>
                        <input
                          id="merchant_name"
                          type="text"
                          maxLength={30}
                          placeholder="Ex: Pizzaria do João — Copacabana"
                          value={config.merchant_name || ''}
                          onChange={(e) => setConfig({ ...config, merchant_name: e.target.value })}
                          className="field"
                        />
                        <p className="helper-text">Nome que aparece no topo da tela do cliente.</p>
                      </div>
                    </div>

                    <button type="submit" disabled={saving} className="btn-primary w-full mt-4">
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Salvar Todas as Configurações
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="card-accent" />
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="section-title mb-0">Relatório de Transações</h2>
                <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest bg-[var(--surface-1)] px-3 py-1.5 rounded-lg border border-[var(--surface-border)]">
                  <Clock className="w-3 h-3" />
                  Últimos 60 dias · {transactions.length} registros
                </div>
              </div>

              <div className="overflow-x-auto -mx-8">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--surface-1)] border-y border-[var(--surface-border)]">
                      <th className="px-8 py-4 text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase text-left tracking-wider">
                        Data e Hora
                      </th>
                      <th className="px-8 py-4 text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase text-left tracking-wider">
                        Identificador (TXID)
                      </th>
                      <th className="px-8 py-4 text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase text-right tracking-wider">
                        Valor Recebido
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--surface-border)]">
                    {transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-8 py-16 text-center text-[var(--text-tertiary)] italic text-[13px]"
                        >
                          Nenhuma transação registrada no período.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-[var(--surface-1)]/50 transition-colors"
                        >
                          <td className="px-8 py-4 text-[13px] text-[var(--text-secondary)] font-medium">
                            {tx.timestamp?.toDate().toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-8 py-4 text-[13px] font-mono text-[var(--text-tertiary)] uppercase">
                            {tx.identificador || 'N/A'}
                          </td>
                          <td className="px-8 py-4 text-right">
                            {tx.amount > 0 ? (
                              <span className="font-extrabold text-[15px] text-[var(--text-primary)]">
                                R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-[var(--color-warning)] uppercase tracking-wider bg-[var(--color-warning)]/5 px-2 py-1 rounded">
                                Valor Livre
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'team' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="card">
              <div className="card-accent" />
              <div className="p-8">
                <h2 className="section-title">Convidar Novo Administrador</h2>
                <p className="text-[13px] text-[var(--text-secondary)] -mt-4 mb-8">
                  O convidado terá acesso total ao painel administrativo.
                </p>

                <form onSubmit={handleAddAdmin} className="space-y-6">
                  <div>
                    <label htmlFor="new_admin_email" className="label-sm">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <input
                        id="new_admin_email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="field pl-11"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="new_admin_name" className="label-sm">
                      Nome de Exibição
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <input
                        id="new_admin_name"
                        type="text"
                        placeholder="Nome Completo"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="field pl-11"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving || countAdmins >= 3}
                    className="btn-primary w-full"
                  >
                    Enviar Convite
                  </button>
                  {countAdmins >= 3 && (
                    <p className="helper-text text-[var(--color-error)] text-center font-bold">
                      Limite de 3 administradores atingido para seu plano.
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-accent" />
              <div className="p-8">
                <h2 className="section-title">Equipe de Gestão</h2>
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div
                      key={admin.uid}
                      className="flex items-center justify-between p-4 bg-[var(--surface-1)] rounded-[var(--radius-md)] border border-[var(--surface-border)]"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--text-primary)] text-[14px] truncate">
                          {admin.username}
                        </p>
                        <p className="text-[12px] text-[var(--text-tertiary)] truncate">
                          {admin.email}
                        </p>
                      </div>

                      {admin.uid !== auth.currentUser?.uid ? (
                        <button
                          onClick={() => removeAdmin(admin.uid)}
                          className="btn-ghost btn-sm group"
                          aria-label="Remover administrador"
                          title="Remover administrador"
                        >
                          <Trash2 className="w-4 h-4 transition-colors group-hover:text-[var(--color-error)]" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-[var(--color-pix-purple)] bg-[var(--color-pix-purple)]/5 px-2 py-1 rounded uppercase tracking-wider">
                          Você
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
