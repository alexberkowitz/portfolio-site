import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from '@/components/Link/Link';
import { highlight } from 'sugar-high';
import CodeHeader from './CodeHeader';

import styles from './mdx.module.scss';



/*-------------------------------------------------------*/
/* ELEMENTS
/*-------------------------------------------------------*/

// H1 - H6
function Heading(level) {
  const HeadingElem = ({ children }) => {
    const slug = slugify(children);
    return (
      <div className={styles[`h${level}`]}>
        {level === 1 && <div className={styles.marker}></div>}
        {
          React.createElement(
            `h${level + 1}`,
            { id: slug },
            <span className={styles.text}>
              {children}
            </span>
          )
        }
      </div>
    )
  }

  return HeadingElem;
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

// Paragraph
function P(props) {
  return (
    <p>
      <span className={styles.text}>{props.children}</span>
    </p>
  )
}

// Anchor
function CustomLink(props) {
  return (
    <Link
      href={props.href}
      className={styles.link}
      {...props}
      >
      {props.children}
    </Link>
  );
}

// Image
function CustomImage(props) {
  return <img {...props} alt={props.alt} className={`${styles.image} ${styles[props.className]}`} />
}

// Horizontal Rule
function HR(props) {
  return <hr className={styles.hr} />
}

// Preformatted
function Pre(props) {
  return (
    <pre className={styles.pre}>
      <CodeHeader language={props.children.props.className?.replace('language-', '')}/>
      {props.children}
    </pre>
  )
}

// Code block
function Code({ children, ...props }) {
  let codeHTML = highlight(children);
  return (
    <code
      {...props}
      className={`${styles.code} ${props.className}`}
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      />
  )
}

// Blockquote
function Blockquote(props) {
  return (
    <blockquote className={styles.blockquote}>
      {props.children}
    </blockquote>
  )
}

// Ordered List
function OL(props) {
  return (
    <ol className={styles.ol}>
      {props.children}
    </ol>
  )
}

// Unordered List
function UL(props) {
  return (
    <ul className={styles.ul}>
      {props.children}
    </ul>
  )
}



/*-------------------------------------------------------*/
/* WRAPPERS & MODIFIERS
/*-------------------------------------------------------*/

// Columns
function Columns(props) {
  return (
    <div className={styles.columns}>
      {props.children}
    </div>
  )
}

// Full-width element
function Wide(props) {
  return (
    <div className={styles.wide}>
      {props.children}
    </div>
  )
}


const components = {
  h1: Heading(1),
  h2: Heading(2),
  h3: Heading(3),
  h4: Heading(4),
  h5: Heading(5),
  h6: Heading(6),
  p: P,
  a: CustomLink,
  img: CustomImage,
  hr: HR,
  pre: Pre,
  code: Code,
  blockquote: Blockquote,
  ol: OL,
  ul: UL,
  Columns,
  Wide
}

export function CustomMDX(props) {
  return (
    <div className={styles.mdx}>
      <MDXRemote
        {...props}
        components={{ ...components, ...(props.components || {}) }}
      />
    </div>
  )
}