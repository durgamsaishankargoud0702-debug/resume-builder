import React, { forwardRef } from 'react';
import styles from '../styles/Preview.module.css';
import { Mail, Phone, MapPin, Link as LinkIcon, Globe, Github, Linkedin } from 'lucide-react';

const Preview = forwardRef(({ data, photoSettings, onPhotoClick, activeTemplate = 'modern', showProfilePhoto = true }, ref) => {
    const { profilePhoto, photoConfig } = data;

    const config = data.photoConfig || { shape: 'circle', size: 'medium' };

    const formatUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `https://${url}`;
    };

    // Template specific classes
    const containerClass = `${styles.previewContainer} ${styles[activeTemplate] || styles.modern}`;

    return (
        <div id="resume-preview" className={containerClass} ref={ref}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.headerText}>
                        <h1 className={styles.name}>{data.personal.name}</h1>
                        <div className={styles.contactInfo}>
                            {data.personal.email && (
                                <div className={styles.contactItem}>
                                    <Mail size={14} />
                                    <span>{data.personal.email}</span>
                                </div>
                            )}
                            {data.personal.phone && (
                                <div className={styles.contactItem}>
                                    <Phone size={14} />
                                    <span>{data.personal.phone}</span>
                                </div>
                            )}
                            {data.personal.address && (
                                <div className={styles.contactItem}>
                                    <MapPin size={14} />
                                    <span>{data.personal.address}</span>
                                </div>
                            )}
                            {data.personal.portfolio && (
                                <div className={styles.contactItem} style={{ display: 'block' }}>
                                    <Globe size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                    <a href={formatUrl(data.personal.portfolio)} style={{ color: '#2563eb', textDecoration: 'none', display: 'inline' }}>
                                        {data.personal.portfolio}
                                    </a>
                                </div>
                            )}
                            {data.personal.github && (
                                <div className={styles.contactItem} style={{ display: 'block' }}>
                                    <Github size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                    <a href={formatUrl(data.personal.github)} style={{ color: '#2563eb', textDecoration: 'none', display: 'inline' }}>
                                        {data.personal.github}
                                    </a>
                                </div>
                            )}
                            {data.personal.linkedin && (
                                <div className={styles.contactItem} style={{ display: 'block' }}>
                                    <Linkedin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                    <a href={formatUrl(data.personal.linkedin)} style={{ color: '#2563eb', textDecoration: 'none', display: 'inline' }}>
                                        {data.personal.linkedin}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Photo Section */}
                    {showProfilePhoto && (
                        <div
                            className={`${styles.profilePhotoSection} ${styles[`shape${config.shape === 'square' ? 'Square' : 'Circle'}`]} ${styles[`size${config.size ? config.size.charAt(0).toUpperCase() + config.size.slice(1) : 'Medium'}`]}`}
                            onClick={onPhotoClick}
                            title="Click to change photo"
                        >
                            {profilePhoto ? (
                                <img src={profilePhoto} alt="Profile" className={styles.profilePhoto} />
                            ) : (
                                <div className={styles.photoPlaceholder}>
                                    <span>Add Photo</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {data.personal.summary && (
                    <p className={styles.description} style={{ marginTop: '1rem' }}>
                        {data.personal.summary}
                    </p>
                )}
            </div>

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Experience</h2>
                    {data.experience.map((exp) => (
                        <div key={exp.id} className={styles.experienceItem}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemTitle}>{exp.company}</span>
                                <span className={styles.date}>{exp.duration}</span>
                            </div>
                            <div className={styles.itemSubtitle}>{exp.role}</div>
                            {exp.description && <p className={styles.description}>{exp.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Education</h2>
                    {data.education.map((edu) => (
                        <div key={edu.id} className={styles.educationItem}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemTitle}>{edu.school}</span>
                                <span className={styles.date}>{edu.year}</span>
                            </div>
                            <div className={styles.itemSubtitle}>{edu.degree}</div>
                            {edu.description && <p className={styles.description}>{edu.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Projects</h2>
                    {data.projects.map((proj) => (
                        <div key={proj.id} className={styles.projectItem}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemTitle}>{proj.name}</span>
                                {proj.link && (
                                    <span className={styles.date} style={{ display: 'block' }}>
                                        <LinkIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                        <a href={formatUrl(proj.link)} style={{ color: '#2563eb', textDecoration: 'none', display: 'inline' }}>
                                            Link
                                        </a>
                                    </span>
                                )}
                            </div>
                            {proj.description && <p className={styles.description}>{proj.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Skills</h2>
                    <div className={styles.skillsList}>
                        {data.skills.map((skill, index) => (
                            <span key={index} className={styles.skillTag}>{skill}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

Preview.displayName = 'Preview';

export default Preview;
