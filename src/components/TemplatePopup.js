import React from 'react';
import styles from '../styles/AuthPopup.module.css'; // Reusing modal styles for consistency

export default function TemplatePopup({ isOpen, onClose, currentTemplate, onSelectTemplate }) {
    if (!isOpen) return null;

    const templates = [
        { id: 'classicAts', name: 'Classic ATS', category: 'ATS', description: 'Standard, parseable format' },
        { id: 'minimalAts', name: 'Minimal ATS', category: 'ATS', description: 'Clean and simple' },
        { id: 'professionalAts', name: 'Professional ATS', category: 'ATS', description: 'Corporate standard' },
        { id: 'modernAts', name: 'Modern ATS', category: 'ATS', description: 'Contemporary yet parseable' },
        { id: 'executiveAts', name: 'Executive ATS', category: 'ATS', description: 'Senior level layout' },
        { id: 'hybridAts', name: 'Hybrid ATS', category: 'ATS', description: 'Balanced design' },
        { id: 'creative', name: 'Creative', category: 'Modern', description: 'Stand out from the crowd' },
        { id: 'clean', name: 'Clean', category: 'Modern', description: 'Whitespace focused' },
        { id: 'elegant', name: 'Elegant', category: 'Modern', description: 'Sophisticated typography' },
    ];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%' }}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <h2 className={styles.title}>Choose Template</h2>
                <p className={styles.subtitle}>Select a design for your resume</p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '2rem',
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '0.5rem'
                }}>
                    {templates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => onSelectTemplate(template.id)}
                            className={styles.authButton}
                            style={{
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                height: 'auto',
                                padding: '0',
                                overflow: 'hidden',
                                border: currentTemplate === template.id ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                                backgroundColor: 'white',
                                transition: 'all 0.2s ease',
                                transform: currentTemplate === template.id ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: currentTemplate === template.id ? '0 4px 12px rgba(139, 92, 246, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)'
                            }}
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
                                letterSpacing: '0.05em'
                            }}>
                                {template.name} Preview
                            </div>

                            <div style={{ padding: '1rem', width: '100%', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: '600', color: '#111827' }}>{template.name}</span>
                                    {currentTemplate === template.id && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{template.description}</div>
                                <span style={{
                                    display: 'inline-block',
                                    marginTop: '0.5rem',
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
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
