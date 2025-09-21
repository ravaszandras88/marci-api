import React, { useState } from "react";

export default function Example() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');

        try {
            const response = await fetch('/api/send-contact-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center text-sm text-white">
            <p className="text-xs bg-gray-800 text-white font-medium px-3 py-1 rounded-full mb-3">Contact Us</p> 
            <h1 className="text-2xl md:text-3xl font-bold pb-4 text-center">Let's Get In Touch.</h1>
            <p className="text-base text-gray-300 pb-8 text-center">
                Or just reach out manually to us at <a href="mailto:business@marcelnyiro.com" className="text-white hover:underline break-all">business@marcelnyiro.com</a>
            </p>
            
            <div className="w-full max-w-sm">
                <label htmlFor="name" className="font-medium text-base block mb-2">Full Name</label>
                <div className="flex items-center h-14 px-4 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden  mb-4">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mr-3">
                        <path d="M18.311 16.406a9.64 9.64 0 0 0-4.748-4.158 5.938 5.938 0 1 0-7.125 0 9.64 9.64 0 0 0-4.749 4.158.937.937 0 1 0 1.623.938c1.416-2.447 3.916-3.906 6.688-3.906 2.773 0 5.273 1.46 6.689 3.906a.938.938 0 0 0 1.622-.938M5.938 7.5a4.063 4.063 0 1 1 8.125 0 4.063 4.063 0 0 1-8.125 0" fill="#475569"/>
                    </svg>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-full w-full outline-none bg-transparent text-base" 
                        placeholder="Enter your full name" 
                        required 
                        autoComplete="name"
                    />
                </div>
        
                <label htmlFor="email-address" className="font-medium text-base block mb-2">Email Address</label>
                <div className="flex items-center h-14 px-4 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden  mb-4">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mr-3">
                        <path d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z" fill="#475569"/>
                    </svg>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-full w-full outline-none bg-transparent text-base" 
                        placeholder="Enter your email address" 
                        required 
                        autoComplete="email"
                        inputMode="email"
                    />
                </div>
        
                <label htmlFor="message" className="font-medium text-base block mb-2">Message</label>
                <textarea 
                    rows={5} 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-transparent border border-slate-300 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base " 
                    placeholder="Enter your message" 
                    required
                ></textarea>
                
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 w-full rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed   font-medium text-base"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Sending...
                        </>
                    ) : (
                        <>
                            Submit Form
                            <svg className="mt-0.5" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m18.038 10.663-5.625 5.625a.94.94 0 0 1-1.328-1.328l4.024-4.023H3.625a.938.938 0 0 1 0-1.875h11.484l-4.022-4.025a.94.94 0 0 1 1.328-1.328l5.625 5.625a.935.935 0 0 1-.002 1.33" fill="#fff"/>
                            </svg>
                        </>
                    )}
                </button>
                
                {submitStatus === 'success' && (
                    <div className="mt-4 p-3 bg-green-600/20 border border-green-600/30 rounded-lg text-green-400 text-center">
                        ✅ Message sent successfully! We'll get back to you soon.
                    </div>
                )}
                
                {submitStatus === 'error' && (
                    <div className="mt-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-center">
                        ❌ Failed to send message. Please try again or contact us directly.
                    </div>
                )}
            </div>
        </form>
    );
};

