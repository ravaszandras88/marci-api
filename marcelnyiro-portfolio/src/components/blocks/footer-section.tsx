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
			{ title: 'Speaking', href: '#services' },
			{ title: 'Mentoring', href: '#services' },
			{ title: 'Advisory', href: '#services' },
			{ title: 'Consultation', href: '#contact' },
		],
	},
	{
		label: 'About',
		links: [
			{ title: 'Achievements', href: '#achievements' },
			{ title: 'Testimonials', href: '#testimonials' },
			{ title: 'Contact', href: '#contact' },
			{ title: 'Outfino', href: 'https://outfino.com' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Portfolio.hu', href: 'https://www.portfolio.hu/uzlet/20250813/z-generacios-divat-app-moge-allt-be-az-elso-magyar-egyetemi-hatteru-kockazatitoke-befekteto-779479' },
			{ title: 'OUVC', href: 'https://obudaunivc.com/mesterseges-intelligencia-a-divatban-z-generacios-platformba-fektetett-az-ouvc/' },
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
		<footer className="relative w-full bg-black border-t border-gray-800 px-6 lg:px-8 py-16 lg:py-20">
			<div className="absolute inset-0">
				<div className="absolute top-0 left-20 w-64 md:w-96 h-64 md:h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-20 w-48 md:w-80 h-48 md:h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
			</div>
			
			<div className="relative z-10 max-w-7xl mx-auto">
				<div className="flex flex-col gap-12 lg:grid lg:grid-cols-3 lg:gap-16">
					<div className="space-y-4">
						<div className="text-2xl lg:text-3xl font-bold text-white">
							Marcel <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nyirő</span>
						</div>
						<p className="text-gray-300 text-base">
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

					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-2">
						{footerLinks.map((section) => (
							<div key={section.label} className="flex flex-col">
								<h3 className="text-white font-semibold text-base mb-4">{section.label}</h3>
								<ul className="space-y-2">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm inline-flex items-center py-1"
											>
												{link.icon && <link.icon className="mr-2 w-5 h-5 flex-shrink-0" />}
												<span>{link.title}</span>
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				
				<div className="mt-12 pt-8 border-t border-gray-800">
					<div className="flex flex-col gap-4 items-center text-center">
						<div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-400">
							<span>Portfolio.hu Featured</span>
							<span>Growth Magazine Award</span>
							<span>STRT Program</span>
						</div>
						<div className="text-xs text-gray-400">
							Built with passion in Budapest 🇭🇺
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};