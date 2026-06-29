import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useAppData } from '../context/DataContext'
import {
  loginAdmin,
  logoutAdmin,
  isAdminLoggedIn,
  exportAppData,
  importAppData,
  resetAppData,
  changeAdminPassword,
  generateId,
} from '../services/storage'
import { getScenariosForAge } from '../services/gameEngine'
import { AGE_RANGE, GAME_CONFIG } from '../constants/game'
import type { Scenario, Choice } from '../types'

export function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdminLoggedIn()) navigate('/admin')
  }, [navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginAdmin(password)) navigate('/admin')
    else setError('Mật khẩu không đúng')
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        <Card>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-calm-800">Đăng nhập Admin</h2>
            <p className="text-sm text-calm-500 mt-2">Quản lý tình huống theo độ tuổi</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-calm-700 mb-1.5">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-calm-200 focus:border-calm-500 outline-none"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" size="lg">Đăng nhập</Button>
          </form>
          <p className="text-xs text-calm-400 text-center mt-6">
            Mặc định: <code className="bg-calm-50 px-1 rounded">admin123</code>
          </p>
        </Card>
      </div>
    </Layout>
  )
}

export function AdminDashboardPage() {
  const { data, updateData, refreshData } = useAppData()
  const navigate = useNavigate()
  const [selectedAge, setSelectedAge] = useState<number>(GAME_CONFIG.MIN_AGE)
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null)
  const [activeTab, setActiveTab] = useState<'ages' | 'settings'>('ages')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isAdminLoggedIn()) navigate('/admin/login')
  }, [navigate])

  const showMsg = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const ageStats = useMemo(() => {
    return AGE_RANGE.map((age) => ({
      age,
      count: getScenariosForAge(data.scenarios, age).length,
    }))
  }, [data.scenarios])

  const scenariosForAge = getScenariosForAge(data.scenarios, selectedAge)

  const handleSaveScenario = (scenario: Scenario) => {
    const exists = data.scenarios.find((s) => s.id === scenario.id)
    const scenarios = exists
      ? data.scenarios.map((s) => (s.id === scenario.id ? scenario : s))
      : [...data.scenarios, scenario]
    updateData({ ...data, scenarios })
    setEditingScenario(null)
    showMsg('Đã lưu tình huống')
  }

  const handleDeleteScenario = (id: string) => {
    if (!confirm('Xóa tình huống này?')) return
    updateData({ ...data, scenarios: data.scenarios.filter((s) => s.id !== id) })
    showMsg('Đã xóa')
  }

  const handleNewScenario = () => {
    const usedSlots = scenariosForAge.map((s) => s.slot)
    let slot = 1
    while (usedSlots.includes(slot) && slot <= data.scenariosPerAge) slot++
    if (slot > data.scenariosPerAge) {
      showMsg(`Đã đủ ${data.scenariosPerAge} tình huống cho tuổi ${selectedAge}`)
      return
    }
    setEditingScenario({
      id: generateId('scenario'),
      age: selectedAge,
      slot,
      title: `Tình huống tuổi ${selectedAge}`,
      situation: '',
      choices: [
        { id: generateId('choice'), text: '', result: '', emotionDelta: 0, logicDelta: 0 },
      ],
    })
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importAppData(file)
      refreshData()
      showMsg('Đã nhập JSON')
    } catch (err) {
      showMsg(err instanceof Error ? err.message : 'Lỗi nhập file')
    }
    e.target.value = ''
  }

  if (editingScenario) {
    return (
      <Layout showFooter={false}>
        <ScenarioEditor
          scenario={editingScenario}
          maxSlot={data.scenariosPerAge}
          onSave={handleSaveScenario}
          onCancel={() => setEditingScenario(null)}
        />
      </Layout>
    )
  }

  return (
    <Layout showFooter={false}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-calm-800">Quản trị nội dung</h1>
            <p className="text-sm text-calm-500 mt-1">
              {data.totalQuestions} câu/lượt · {data.scenariosPerAge} TH/tuổi · Tuổi {data.minAge}–{data.maxAge}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => exportAppData(data)}>Xuất JSON</Button>
            <label className="cursor-pointer">
              <span className="inline-flex px-3 py-1.5 text-sm font-medium rounded-xl border-2 border-calm-300 text-calm-700 hover:bg-calm-50">
                Nhập JSON
              </span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <Button variant="ghost" size="sm" onClick={() => { logoutAdmin(); navigate('/admin/login') }}>
              Đăng xuất
            </Button>
          </div>
        </div>

        {message && (
          <div className="bg-sage-100 text-sage-800 px-4 py-3 rounded-xl text-sm font-medium">{message}</div>
        )}

        <div className="flex gap-1 p-1 bg-calm-100 rounded-xl w-fit">
          {(['ages', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab ? 'bg-white text-calm-800 shadow-card' : 'text-calm-500'
              }`}
            >
              {tab === 'ages' ? 'Theo độ tuổi' : 'Cài đặt'}
            </button>
          ))}
        </div>

        {activeTab === 'ages' && (
          <>
            <Card className="!p-4">
              <p className="text-xs text-calm-500 mb-3">Tổng quan — số tình huống đã soạn / {data.scenariosPerAge}</p>
              <div className="flex flex-wrap gap-2">
                {ageStats.map(({ age, count }) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedAge === age
                        ? 'bg-calm-500 text-white'
                        : count >= data.scenariosPerAge
                          ? 'bg-sage-100 text-sage-700'
                          : count > 0
                            ? 'bg-calm-100 text-calm-700 hover:bg-calm-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {age}t ({count})
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-calm-800">
                Tuổi {selectedAge} — {scenariosForAge.length}/{data.scenariosPerAge} tình huống
              </h2>
              <Button size="sm" onClick={handleNewScenario}>+ Thêm tình huống</Button>
            </div>

            {scenariosForAge.length === 0 ? (
              <Card className="text-center py-8 text-calm-500 text-sm">
                Chưa có tình huống cho tuổi {selectedAge}. Hệ thống cần ít nhất 1 tình huống/tuổi để bốc ngẫu nhiên.
              </Card>
            ) : (
              <div className="space-y-3">
                {scenariosForAge.map((s) => (
                  <Card key={s.id} className="!p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono bg-calm-100 text-calm-600 px-2 py-0.5 rounded">
                            TH-{s.slot}
                          </span>
                          <h3 className="font-semibold text-calm-800 truncate">{s.title}</h3>
                        </div>
                        <p className="text-sm text-calm-500 line-clamp-2">{s.situation}</p>
                        <p className="text-xs text-calm-400 mt-1">{s.choices.length} lựa chọn</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={() => setEditingScenario(s)}>Sửa</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteScenario(s.id)}>Xóa</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <Card>
            <h3 className="font-semibold text-calm-800 mb-4">Cài đặt chung</h3>
            <div className="space-y-4">
              <FormField label="Tiêu đề" value={data.title} onChange={(v) => updateData({ ...data, title: v })} />
              <FormField label="Mô tả" value={data.description} onChange={(v) => updateData({ ...data, description: v })} multiline />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Số câu mỗi lượt" value={String(data.totalQuestions)} onChange={(v) => updateData({ ...data, totalQuestions: Number(v) || 15 })} />
                <FormField label="TH mỗi tuổi" value={String(data.scenariosPerAge)} onChange={(v) => updateData({ ...data, scenariosPerAge: Number(v) || 10 })} />
                <FormField label="Điểm TC ban đầu" value={String(data.initialEmotionScore)} onChange={(v) => updateData({ ...data, initialEmotionScore: Number(v) || 50 })} />
                <FormField label="Điểm LT ban đầu" value={String(data.initialLogicScore)} onChange={(v) => updateData({ ...data, initialLogicScore: Number(v) || 50 })} />
              </div>
              <div className="border-t border-calm-100 pt-4">
                <label className="block text-sm font-medium text-calm-700 mb-1.5">Đổi mật khẩu</label>
                <div className="flex gap-2">
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-calm-200 outline-none" placeholder="Mật khẩu mới" />
                  <Button size="sm" onClick={() => { if (newPassword.length >= 4) { changeAdminPassword(newPassword); setNewPassword(''); showMsg('Đã đổi mật khẩu') } }}>Đổi</Button>
                </div>
              </div>
              <Button variant="danger" size="sm" onClick={() => { if (confirm('Khôi phục dữ liệu mặc định?')) { resetAppData(); refreshData(); showMsg('Đã khôi phục') } }}>
                Khôi phục mặc định
              </Button>
            </div>
          </Card>
        )}

        <div className="text-center pt-4">
          <Link to="/" className="text-sm text-calm-500 hover:text-calm-700">← Về trang chủ</Link>
        </div>
      </div>
    </Layout>
  )
}

function FormField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const cls = 'w-full px-4 py-2.5 rounded-xl border border-calm-200 focus:border-calm-500 outline-none'
  return (
    <div>
      <label className="block text-sm font-medium text-calm-700 mb-1.5">{label}</label>
      {multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />}
    </div>
  )
}

function ScenarioEditor({
  scenario,
  maxSlot,
  onSave,
  onCancel,
}: {
  scenario: Scenario
  maxSlot: number
  onSave: (s: Scenario) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<Scenario>(scenario)

  const updateChoice = (index: number, field: keyof Choice, value: string | number) => {
    const choices = [...draft.choices]
    choices[index] = { ...choices[index], [field]: value }
    setDraft({ ...draft, choices })
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-calm-800">
          Tuổi {draft.age} · TH-{draft.slot}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Hủy</Button>
          <Button size="sm" onClick={() => onSave(draft)}>Lưu</Button>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-calm-700 mb-1.5">Số thứ tự (1–{maxSlot})</label>
            <input type="number" min={1} max={maxSlot} value={draft.slot} onChange={(e) => setDraft({ ...draft, slot: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-calm-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-calm-700 mb-1.5">Độ tuổi</label>
            <input type="number" value={draft.age} onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-calm-200 outline-none" />
          </div>
        </div>
        <FormField label="Tiêu đề" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        <FormField label="Mô tả tình huống" value={draft.situation} onChange={(v) => setDraft({ ...draft, situation: v })} multiline />
      </Card>

      <div>
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold text-calm-800">Lựa chọn & điểm số</h3>
          <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, choices: [...draft.choices, { id: generateId('choice'), text: '', result: '', emotionDelta: 0, logicDelta: 0 }] })}>
            + Thêm
          </Button>
        </div>
        <div className="space-y-4">
          {draft.choices.map((choice, i) => (
            <Card key={choice.id} className="!p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-calm-600">Lựa chọn {String.fromCharCode(65 + i)}</span>
                {draft.choices.length > 1 && (
                  <button onClick={() => setDraft({ ...draft, choices: draft.choices.filter((_, j) => j !== i) })} className="text-xs text-red-500">Xóa</button>
                )}
              </div>
              <FormField label="Nội dung" value={choice.text} onChange={(v) => updateChoice(i, 'text', v)} multiline />
              <FormField label="Phản hồi sau chọn" value={choice.result} onChange={(v) => updateChoice(i, 'result', v)} multiline />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-1.5">💗 Tình cảm (+/−)</label>
                  <input type="number" value={choice.emotionDelta} onChange={(e) => updateChoice(i, 'emotionDelta', Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-rose-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-calm-700 mb-1.5">🧠 Lý trí (+/−)</label>
                  <input type="number" value={choice.logicDelta} onChange={(e) => updateChoice(i, 'logicDelta', Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-calm-200 outline-none" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
