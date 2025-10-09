export interface PetService {
  id: string
  name: string
  description: string
  type: 'boarding' | 'grooming' | 'medical' | 'training'
  price: number
  duration: number
  provider: string
  providerAvatar: string
  rating: number
  reviewCount: number
  images: string[]
  location: string
  isAvailable: boolean
  createdAt: string
}

export interface PetProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  stock: number
  sales: number
  rating: number
  reviewCount: number
  specifications: Record<string, string>
  createdAt: string
}

export interface PetAppointment {
  id: string
  petId: string
  serviceId: string
  serviceName: string
  provider: string
  appointmentDate: string
  appointmentTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
}
