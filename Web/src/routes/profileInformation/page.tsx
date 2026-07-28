import { PageHeader } from '@/components/global/PageHeader'
import { CompleteUserAccount } from '@/components/users/CompleteUserAccount'
import { BadgeCheck } from 'lucide-react'

export default function ProfileInformation() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Completar perfil' },
        ]}
        title="Completa tu cuenta"
        description="Captura tu domicilio y la información fiscal necesaria para habilitar el resto del sistema."
        icon={<BadgeCheck className="h-5 w-5" />}
      />

      <CompleteUserAccount />
    </div>
  )
}