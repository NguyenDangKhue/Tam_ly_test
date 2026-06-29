import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { useAppData } from '../context/DataContext'

export function HomePage() {
  const { data } = useAppData()
  const ageCount = data.maxAge - data.minAge + 1
  const totalScenarios = data.scenarios.length

  return (
    <Layout>
      <div className="text-center py-8 sm:py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-calm-100 text-calm-700 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-sage-500 rounded-full animate-pulse" />
          {data.totalQuestions} câu · Tuổi {data.minAge}→{data.minAge + data.totalQuestions - 1}
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-calm-800 leading-tight mb-6">
          {data.title}
        </h1>

        <p className="text-lg text-calm-600 max-w-2xl mx-auto leading-relaxed mb-10">
          {data.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/play">
            <Button size="lg" className="min-w-[200px]">
              Bắt đầu
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <FeatureCard
            icon="🎯"
            title={`${data.totalQuestions} câu theo tuổi`}
            description={`Câu 1: ${data.minAge} tuổi → câu ${data.totalQuestions}: ${data.minAge + data.totalQuestions - 1} tuổi. Mỗi tuổi bốc ngẫu nhiên 1/${data.scenariosPerAge} tình huống`}
          />
          <FeatureCard
            icon="💗"
            title="Điểm Tình cảm"
            description="Phản ánh mức độ thấu hiểu và đồng cảm với cảm xúc của trẻ"
          />
          <FeatureCard
            icon="🧠"
            title="Điểm Lý trí"
            description="Phản ánh cách xử lý tình huống có hệ thống, dựa trên kiến thức"
          />
        </div>

        <div className="inline-flex flex-wrap justify-center gap-4 text-sm text-calm-500">
          <span>{ageCount} độ tuổi</span>
          <span>·</span>
          <span>{totalScenarios} tình huống đã soạn</span>
          <span>·</span>
          <span>Điểm khởi đầu: {data.initialEmotionScore}/{data.initialLogicScore}</span>
        </div>
      </div>
    </Layout>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl border border-calm-100 p-6 shadow-card text-left">
      <div className="w-12 h-12 rounded-xl bg-calm-100 flex items-center justify-center mb-4 text-2xl">
        {icon}
      </div>
      <h3 className="font-semibold text-calm-800 mb-2">{title}</h3>
      <p className="text-sm text-calm-500 leading-relaxed">{description}</p>
    </div>
  )
}
