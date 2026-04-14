'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Lock, CheckCircle } from 'lucide-react';

export default function TemplateCard({ template, currentTemplate, onSelectTemplate }) {
    const { data: session } = useSession();

    const isPremium = template.isPremium;
    const userIsPremium = session?.user?.isPremium || false;
    const isLocked = isPremium && !userIsPremium;

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                border: currentTemplate === template.id ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                transform: currentTemplate === template.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: currentTemplate === template.id ? '0 8px 16px rgba(139, 92, 246, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                if (currentTemplate !== template.id) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                }
            }}
            onMouseLeave={(e) => {
                if (currentTemplate !== template.id) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }
            }}
            onClick={() => onSelectTemplate(template.id)}
        >
            {/* Thumbnail Placeholder */}
            <div style={{
                width: '100%',
                height: '140px',
                backgroundColor: '#f3f4f6',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                position: 'relative'
            }}>
                {template.name} Preview
                
                {isPremium && (
                    <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: isLocked ? '#fef3c7' : '#dcfce7',
                        color: isLocked ? '#92400e' : '#166534',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '0.375rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontSize: '0.65rem',
                        fontWeight: '600'
                    }}>
                        {isLocked ? <Lock size={10} /> : <CheckCircle size={10} />}
                        {isLocked ? 'PRO' : 'UNLOCKED'}
                    </div>
                )}
            </div>

            <div style={{ padding: '1rem', width: '100%', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600', color: '#111827' }}>{template.name}</span>
                    {currentTemplate === template.id && (
                        <CheckCircle size={16} color="#8b5cf6" />
                    )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', minHeight: '38px' }}>{template.description}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor: template.category === 'ATS' ? '#e0f2fe' : '#fce7f3',
                        color: template.category === 'ATS' ? '#0369a1' : '#be185d',
                        fontWeight: '500'
                    }}>
                        {template.category}
                    </span>
                </div>
                
                <button
                    style={{
                        marginTop: '0.75rem',
                        width: '100%',
                        padding: '0.4rem',
                        borderRadius: '0.375rem',
                        backgroundColor: currentTemplate === template.id ? '#8b5cf6' : (isLocked ? '#fef3c7' : '#f3f4f6'),
                        color: currentTemplate === template.id ? 'white' : (isLocked ? '#92400e' : '#374151'),
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: '1px solid',
                        borderColor: currentTemplate === template.id ? '#8b5cf6' : (isLocked ? '#fcd34d' : '#d1d5db'),
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    {currentTemplate === template.id ? 'Currently Selected' : (isLocked ? 'Try Template' : 'Select')}
                </button>
            </div>
        </div>
    );
}
