import Image from 'next/image'
import RecentlyAdded from './components/RecentlyAdded'
import HomeCarousel from './components/HomeCarousel'

export default function Home() {
  return (
    <>
      <HomeCarousel />
      <div className='p-7 px-9'>
        <h1 className='text-2xl font-bold'>Recientes</h1>
          <RecentlyAdded />
      </div>
    </>
  )
}
