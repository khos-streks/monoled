'use client'

import { useState } from 'react'

export default function PartnersPage() {
	// Fake partner data
	const partners = [
		{
			id: 1,
			name: 'Electro Solutions',
			email: 'info@electrosolutions.com',
			phone: '+380 44 123 4567',
			address: 'вул. Хрещатик 10, Київ, 01001',
			city: 'Київ'
		},
		{
			id: 2,
			name: 'Light Technologies',
			email: 'contact@lighttech.ua',
			phone: '+380 44 765 4321',
			address: 'вул. Велика Васильківська 72, Київ, 03150',
			city: 'Київ'
		},
		{
			id: 3,
			name: 'Innovation Electronics',
			email: 'sales@innovation-e.com',
			phone: '+380 32 987 6543',
			address: 'вул. Городоцька 15, Львів, 79007',
			city: 'Львів'
		},
		{
			id: 4,
			name: 'Smart Lighting Group',
			email: 'info@smartlighting.ua',
			phone: '+380 48 567 8901',
			address: 'вул. Дерибасівська 22, Одеса, 65026',
			city: 'Одеса'
		},
		{
			id: 5,
			name: 'Future LED Systems',
			email: 'support@futureled.com.ua',
			phone: '+380 56 234 5678',
			address: 'просп. Дмитра Яворницького 45, Дніпро, 49000',
			city: 'Дніпро'
		},
		{
			id: 6,
			name: 'Eco Light Solutions',
			email: 'hello@ecolight.ua',
			phone: '+380 57 345 6789',
			address: 'вул. Сумська 53, Харків, 61002',
			city: 'Харків'
		}
	]

	// Get unique cities for filter
	const cities = ['Усі міста', ...new Set(partners.map(partner => partner.city))]

	// State for selected city
	const [selectedCity, setSelectedCity] = useState('Усі міста')

	// Filter partners based on selected city
	const filteredPartners =
		selectedCity === 'Усі міста'
			? partners
			: partners.filter(partner => partner.city === selectedCity)

	return (
		<section className='flex flex-col py-10'>
			<div className='container mx-auto flex flex-col gap-10 px-4'>
				<h1 className='text-5xl font-medium'>Наші партнери</h1>

				{/* City filter */}
				<div className='flex flex-col gap-4'>
					<h2 className='text-2xl font-medium'>Фільтр за містом</h2>
					<div className='flex flex-wrap gap-3'>
						{cities.map(city => (
							<button
								key={city}
								onClick={() => setSelectedCity(city)}
								className={`px-4 py-2 rounded-full border transition-colors ${
									selectedCity === city
										? 'bg-black text-white border-black'
										: 'bg-white text-black border-gray-300 hover:border-black'
								}`}
							>
								{city}
							</button>
						))}
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{filteredPartners.map(partner => (
						<div
							key={partner.id}
							className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'
						>
							<h2 className='text-2xl font-medium mb-4'>{partner.name}</h2>
							<div className='flex flex-col gap-2'>
								<div className='flex items-start gap-2'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5 mt-0.5 text-gray-500'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
										/>
									</svg>
									<span>{partner.email}</span>
								</div>
								<div className='flex items-start gap-2'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5 mt-0.5 text-gray-500'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
										/>
									</svg>
									<span>{partner.phone}</span>
								</div>
								<div className='flex items-start gap-2'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5 mt-0.5 text-gray-500'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
										/>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
										/>
									</svg>
									<span>{partner.address}</span>
								</div>
								<div className='flex items-start gap-2 mt-1'>
									<span className='px-3 py-1 bg-gray-100 rounded-full text-sm font-medium'>
										{partner.city}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{filteredPartners.length === 0 && (
					<div className='bg-gray-50 p-6 rounded-lg text-center'>
						<p className='text-lg'>У вибраному місті немає партнерів.</p>
					</div>
				)}

				<div className='mt-10 bg-gray-50 p-6 rounded-lg'>
					<h2 className='text-2xl font-medium mb-4'>Стати нашим партнером</h2>
					<p className='mb-6'>
						Ми завжди відкриті до нових партнерських відносин. Якщо ви зацікавлені у співпраці, будь
						ласка, зв'яжіться з нами.
					</p>
					<button className='px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors'>
						Зв'язатися з нами
					</button>
				</div>
			</div>
		</section>
	)
}
