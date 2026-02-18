export interface Question {
  question_id: string
  type: string
  text: string
  scale: { min: number; max: number; labels: string[] }
  dimension_weights: Record<string, number>
  reverse_scoring: boolean
}

export interface QuestionData {
  version: string
  dimensions: string[]
  questions: Question[]
  consistency_checks: string[]
}

export interface City {
  city_id: string
  city_name: string
  country_name: string
  region: string
  lat: number
  lon: number
  dimension_scores: Record<string, number>
  tags: string[]
  known_tradeoffs: string[]
  confidence: string
}

export interface CityData {
  version: string
  generated_at: string
  cities: City[]
}

export interface UserProfile {
  scores: Record<string, number>
  weights: Record<string, number>
}

export interface CityMatch extends City {
  match_score: number
  contributions: Record<string, number>
  top_factors: string[]
  top_risks: string[]
}
