import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from '../styles/ResumeBuilder.module.css';

export default function Editor({
    data,
    updatePersonal,
    handlePhotoUpload,
    updatePhotoConfig,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addProject,
    updateProject,
    removeProject,
    updateSkills,
    showProfilePhoto,
    setShowProfilePhoto
}) {
    return (
        <div>
            {/* Personal Details */}
            <section className={styles.formGroup}>
                <h2 className={styles.sectionTitle}>Personal Details</h2>
                <div className={styles.inputGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className={styles.label} style={{ marginBottom: 0 }}>Profile Photo</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={showProfilePhoto}
                                onChange={(e) => setShowProfilePhoto(e.target.checked)}
                                id="showPhoto"
                            />
                            <label htmlFor="showPhoto" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>Show</label>
                        </div>
                    </div>

                    {showProfilePhoto && (
                        <>
                            <div className={styles.row} style={{ marginBottom: '0.5rem' }}>
                                <select
                                    className={styles.input}
                                    value={data.photoConfig?.shape || 'circle'}
                                    onChange={(e) => updatePhotoConfig('shape', e.target.value)}
                                >
                                    <option value="circle">Circle</option>
                                    <option value="square">Square</option>
                                </select>
                                <select
                                    className={styles.input}
                                    value={data.photoConfig?.size || 'medium'}
                                    onChange={(e) => updatePhotoConfig('size', e.target.value)}
                                >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.input}
                                onChange={handlePhotoUpload}
                            />
                        </>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={data.personal.name}
                        onChange={(e) => updatePersonal('name', e.target.value)}
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={data.personal.email}
                            onChange={(e) => updatePersonal('email', e.target.value)}
                            placeholder="e.g. john@example.com"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Phone</label>
                        <input
                            type="tel"
                            className={styles.input}
                            value={data.personal.phone}
                            onChange={(e) => updatePersonal('phone', e.target.value)}
                            placeholder="e.g. (555) 123-4567"
                        />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Address</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={data.personal.address}
                        onChange={(e) => updatePersonal('address', e.target.value)}
                        placeholder="e.g. New York, NY"
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Portfolio</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={data.personal.portfolio || ''}
                            onChange={(e) => updatePersonal('portfolio', e.target.value)}
                            placeholder="e.g. johndoe.dev"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>GitHub</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={data.personal.github || ''}
                            onChange={(e) => updatePersonal('github', e.target.value)}
                            placeholder="e.g. github.com/johndoe"
                        />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>LinkedIn</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={data.personal.linkedin || ''}
                        onChange={(e) => updatePersonal('linkedin', e.target.value)}
                        placeholder="e.g. linkedin.com/in/johndoe"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Professional Summary</label>
                    <textarea
                        className={styles.textarea}
                        value={data.personal.summary}
                        onChange={(e) => updatePersonal('summary', e.target.value)}
                        placeholder="Brief overview of your professional background..."
                    />
                </div>
            </section>

            {/* Education */}
            <section className={styles.formGroup}>
                <h2 className={styles.sectionTitle}>Education</h2>
                {data.education.map((edu) => (
                    <div key={edu.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <span className={styles.label}>Education #{data.education.indexOf(edu) + 1}</span>
                            <button
                                className={styles.removeButton}
                                onClick={() => removeEducation(edu.id)}
                                title="Remove"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>School / University</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                placeholder="e.g. University of Technology"
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Degree</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    placeholder="e.g. Bachelor of Science"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Year</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={edu.year}
                                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                    placeholder="e.g. 2018 - 2022"
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={edu.description}
                                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                placeholder="Additional details..."
                                style={{ minHeight: '60px' }}
                            />
                        </div>
                    </div>
                ))}
                <button className={`${styles.button} ${styles.addButton}`} onClick={addEducation}>
                    <Plus size={16} /> Add Education
                </button>
            </section>

            {/* Experience */}
            <section className={styles.formGroup}>
                <h2 className={styles.sectionTitle}>Experience</h2>
                {data.experience.map((exp) => (
                    <div key={exp.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <span className={styles.label}>Experience #{data.experience.indexOf(exp) + 1}</span>
                            <button
                                className={styles.removeButton}
                                onClick={() => removeExperience(exp.id)}
                                title="Remove"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Company</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                placeholder="e.g. Tech Solutions Inc."
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Role</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={exp.role}
                                    onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                    placeholder="e.g. Frontend Developer"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Duration</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={exp.duration}
                                    onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                                    placeholder="e.g. 2022 - Present"
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                placeholder="Key responsibilities and achievements..."
                            />
                        </div>
                    </div>
                ))}
                <button className={`${styles.button} ${styles.addButton}`} onClick={addExperience}>
                    <Plus size={16} /> Add Experience
                </button>
            </section>

            {/* Projects */}
            <section className={styles.formGroup}>
                <h2 className={styles.sectionTitle}>Projects</h2>
                {data.projects.map((proj) => (
                    <div key={proj.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <span className={styles.label}>Project #{data.projects.indexOf(proj) + 1}</span>
                            <button
                                className={styles.removeButton}
                                onClick={() => removeProject(proj.id)}
                                title="Remove"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Project Name</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                placeholder="e.g. E-commerce Platform"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Link</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={proj.link}
                                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                                placeholder="e.g. https://github.com/..."
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                placeholder="Project details..."
                                style={{ minHeight: '60px' }}
                            />
                        </div>
                    </div>
                ))}
                <button className={`${styles.button} ${styles.addButton}`} onClick={addProject}>
                    <Plus size={16} /> Add Project
                </button>
            </section>

            {/* Skills */}
            <section className={styles.formGroup}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Skills (comma separated)</label>
                    <textarea
                        className={styles.textarea}
                        value={data.skills.join(', ')}
                        onChange={(e) => updateSkills(e.target.value)}
                        placeholder="e.g. React, JavaScript, CSS, Node.js"
                        style={{ minHeight: '80px' }}
                    />
                </div>
            </section>
        </div>
    );
}
