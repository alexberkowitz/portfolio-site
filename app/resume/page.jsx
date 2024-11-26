'use client'

import { useState } from 'react';
import PageTitle from '@/components/PageTitle/PageTitle';
import Text from '@/components/Text/Text';
import Link from '@/components/Link/Link';

import { skills, tools } from './skills.js';

import styles from './page.module.scss';

export default function Resume() {
  const [skillFilter, setSkillFilter] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState([...skills]);
  const [selectedTools, setSelectedTools] = useState([...tools]);

  const filterSkills = (filter) => {
    let skillsList = [...skills];
    let toolsList = [...tools];

    if( filter !== 'all' ){
      skillsList = [];
      skills.forEach(skill => {
        if( skill.role.indexOf(filter) >= 0 ){
          skillsList.push(skill);
        }
      });

      toolsList = [];
      tools.forEach(tool => {
        if( tool.role.indexOf(filter) >= 0 ){
          toolsList.push(tool);
        }
      });
    }

    setSkillFilter(filter);
    setSelectedSkills(skillsList);
    setSelectedTools(toolsList);
  }

  return (
    <main className={styles.resumePage}>
      <PageTitle>Résumé</PageTitle>
      <p style={{paddingBottom: 'var(--pagePadding)', marginLeft: 'var(--pagePadding)'}}>
        <Text>
          Welcome to my digital résumé! If you&lsquo;d prefer a PDF version, <Link href="#">click here</Link>.
        </Text>
      </p>

      <div className={styles.columns}>

        <div className={styles.column}>
          <section id={styles.experience}>
            <h2 className={styles.sectionTitle}>
              Experience
            </h2>

            <ul className={styles.timeline}>
              <li>
                <div className={styles.title}>
                  <h3 className={styles.company}>UScellular</h3>
                  <p className={styles.date}>January 2022 - present</p>
                </div>
                <p className={styles.role}>
                  <Text>Senior Web UI Application Developer</Text>
                </p>
                <p>
                  <Text>Responsible for development and maintenance of reusable React/AEM components for all web platforms, as well as feature development for mobile apps via React Native. Additionally responsible for team coordination and branching/release workflow. Recently completed development of new React navigation components that resulted in 2s faster page loads across both web and mobile platforms.</Text>
                </p>
              </li>

              <li>
                <div className={styles.title}>
                  <h3 className={styles.company}>FairVote Illinois</h3>
                  <p className={styles.date}>July 2020 - Present</p>
                </div>
                <p className={styles.role}>
                  <Text>Arts & Tech Lead</Text>
                </p>
                <p>
                  <Text>Designed, implemented, and now maintain a new web presence for the organization. Created new FairVote IL brand guides and resources. Conceived, wrote, and animated an explainer video for ranked choice voting. Create multimedia assets for social media.</Text>
                </p>
              </li>

              <li>
                <div className={styles.title}>
                  <h3 className={styles.company}>Eight Bit Studios</h3>
                  <p className={styles.date}>August 2015 - December 2021</p>
                </div>
                <p className={styles.role}>
                  <Text>Front-End Developer, Motion Designer, UI Designer</Text>
                </p>
                <p>
                  <Text>Front-end web development, primarily (but not exclusively) focused on React. Responsible for the design and creation of motion assets including videos and animated interface elements. Developed and implemented a new motion design workflow for mobile interfaces. Helped write comprehensive guidelines for inclusive design.</Text>
              </p>
              </li>
            </ul>
          </section>
        </div>

        <div className={styles.column}>
          <section id={styles.skills}>
            <h2 className={styles.sectionTitle}>
              Skills
            </h2>
            <div className={styles.skillFilter}>
              <label><Text>Filter:</Text></label>
              <div className={styles.buttons}>
                <button
                  onClick={() => filterSkills('all')}
                  className={skillFilter === 'all' ? styles.active : ''}
                  >
                  All
                </button>
                <button
                  onClick={() => filterSkills('designer')}
                  className={skillFilter === 'designer' ? styles.active : ''}
                  >
                  Designer
                </button>
                <button
                  onClick={() => filterSkills('developer')}
                  className={skillFilter === 'developer' ? styles.active : ''}
                  >
                  Developer
                </button>
                <button
                  onClick={() => filterSkills('maker')}
                  className={skillFilter === 'maker' ? styles.active : ''}
                  >
                  Maker
                </button>
              </div>
            </div>
            <ul className={styles.skillsList}>
              {selectedSkills.map((skill, index) => (
                <li
                  key={index}
                  className={styles.skill}
                  >
                  {skill.title}
                </li>
              ))}
            </ul>

            <h3 style={{alignSelf: 'stretch', marginTop: '2rem', textAlign: 'center'}}>Tools</h3>
            <ul className={styles.skillsList}>
              {selectedTools.map((tool, index) => (
                <li
                  key={index}
                  className={styles.tool}
                  >
                  {tool.title}
                </li>
              ))}
            </ul>
          </section>

          <section id={styles.education}>
            <h2 className={styles.sectionTitle}>
              Education
            </h2>
            <div>
              <p>
                <b><Text>Rochester Institute of Techonlogy</Text></b>
              </p>
              <p>
                <small><Text>Graduated 2015 - Cum Laude</Text></small>
              </p>
              <p>
                <Text>Bachelor of Fine Arts, 3D Digital Graphics</Text>
              </p>
              <p>
                <small><Text>Minor in American Sign Language & Deaf Culture</Text></small>
              </p>
            </div>
          </section>
        </div>

      </div>

    </main>
  );
}
