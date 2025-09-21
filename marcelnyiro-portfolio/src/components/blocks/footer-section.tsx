'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { LinkedinIcon } from 'lucide-react';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Services',
		links: [
			{ title: 'Speaking Engagements', href: '#services' },
			{ title: '1-on-1 Mentoring', href: '#services' },
			{ title: 'Business Advisory', href: '#services' },
			{ title: 'Book Consultation', href: '#contact' },
		],
	},
	{
		label: 'About',
		links: [
			{ title: 'Achievements', href: '#achievements' },
			{ title: 'Testimonials', href: '#testimonials' },
			{ title: 'Contact', href: '#contact' },
			{ title: 'Outfino Platform', href: 'https://outfino.com' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Portfolio.hu Article', href: 'https://www.portfolio.hu/uzlet/20250813/z-generacios-divat-app-moge-allt-be-az-elso-magyar-egyetemi-hatteru-kockazatitoke-befekteto-779479' },
			{ title: 'OUVC Investment', href: 'https://obudaunivc.com/mesterseges-intelligencia-a-divatban-z-generacios-platformba-fektetett-az-ouvc/' },
			{ title: 'StartupOnline', href: 'https://startuponline.hu/public/tag/outfino' },
		],
	},
	{
		label: 'Connect',
		links: [
			{ title: 'LinkedIn', href: 'https://www.linkedin.com/in/marcelnyiro/', icon: LinkedinIcon },
			{ title: 'Email', href: 'mailto:business@marcelnyiro.com' },
		],
	},
];

export function Footer() {
	return (
		<footer className="relative w-full bg-black border-t border-gray-800 px-6 py-16 lg:py-20">
			<div className="absolute inset-0">
				<div className="absolute top-0 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
			</div>
			
			<div className="relative z-10 max-w-7xl mx-auto">
				<div className="grid w-full gap-12 xl:grid-cols-3 xl:gap-16">
					<div className="space-y-6">
						<div className="text-3xl font-bold text-white">
							Marcel <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nyirő</span>
						</div>
						<p className="text-gray-300 text-lg">
							AI-Driven Entrepreneur & Business Strategist
						</p>
						<div className="space-y-2">
							<p className="text-blue-400 font-semibold text-sm">73M HUF OUVC Investment</p>
							<p className="text-purple-400 font-semibold text-sm">First Hungarian University VC</p>
						</div>
						<p className="text-gray-400 mt-8 text-sm">
							© {new Date().getFullYear()} Marcel Nyirő. All rights reserved.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
						{footerLinks.map((section) => (
							<div key={section.label}>
								<div className="mb-8 md:mb-0">
									<h3 className="text-white font-semibold text-sm mb-4">{section.label}</h3>
									<ul className="space-y-3">
										{section.links.map((link) => (
											<li key={link.title}>
												<a
													href={link.href}
													className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm inline-flex items-center"
												>
													{link.icon && <link.icon className="me-2 size-4" />}
													{link.title}
												</a>
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>
				</div>
				
				<div className="mt-16 pt-8 border-t border-gray-800">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-8 text-sm text-gray-400">
							<span>Portfolio.hu Featured</span>
							<span>•</span>
							<span>Growth Magazine Award</span>
							<span>•</span>
							<span>STRT Program Member</span>
						</div>
						<div className="text-sm text-gray-400">
							Built with passion in Budapest 🇭🇺
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};