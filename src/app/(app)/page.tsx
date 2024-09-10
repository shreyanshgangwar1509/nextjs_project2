'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import message from '@/messages.json'
import Autoplay from 'embla-carousel-autoplay'
function Home() {

  return (
    <>
    <main className="flex-grow flex flex-col items-center
    justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl font-bold">Your inbox is open to opportunities—make each message </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">You can whisper into the void, send words without trace, but in the silence, only the echo knows your voice</p>
      </section>
      <Carousel
        plugins={[Autoplay({delay:3000})]}
        className="w-full max-w-xs">
      <CarouselContent>
          {message.map((messge, index) => (
            <CarouselItem key={index}>
            <div className="p-1">
                <Card>
                  <CardHeader>{ messge.title}</CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-lg font-semibold">{messge.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          )
          
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      </Carousel>
      
    </main>
      <footer className="text-center font-semibold p-4 md:p-6">
        This is a Message app . All rights reserved.
    </footer>
    </>
  )
}

export default Home