import { Metadata } from 'next'

import DistributorRegister from '@/components/modules/account/components/distributor-register'

export const metadata: Metadata = {
  title: 'Distributor Enrollment',
  description: 'Join our distributor network and start building your business with Ambrosia Global.',
}

export default function DistributorEnrollmentPage() {
  return (
    <div className="flex justify-center py-12">
      <DistributorRegister />
    </div>
  )
}