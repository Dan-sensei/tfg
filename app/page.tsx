import Image from 'next/image'
import RecentlyAdded from './components/RecentlyAdded'
import HomeCarousel from './components/HomeCarousel'


export default function Home() {
  return (
    <div>
      <HomeCarousel />
        <div className='p-4'>
          <h1 className='text-2xl'>Recientes</h1>
          <RecentlyAdded />
        </div>
    </div>
  )
}
