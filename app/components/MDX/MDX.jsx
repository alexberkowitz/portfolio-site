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
function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
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

// Table
function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

// Anchor
function CustomLink(props) {
  const isExternal = !props.href.startsWith('/');

  return (
    <Link
      href={props.href}
      className={styles.link}
      external={isExternal}
      target={isExternal ? '_blank' : ''}
      rel={isExternal ? 'noopener noreferrer' : ''}
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
function blockquote(props) {
  return (
    <blockquote className={styles.blockquote}>
      {props.children}
    </blockquote>
  )
}



/*-------------------------------------------------------*/
/* WRAPPERS & MODIFIERS
/*-------------------------------------------------------*/

// Full-width element
function Wide(props) {
  return (
    <div className={styles.wide}>
      {props.children}
    </div>
  )
}


const components = {
  h1: createHeading(2),
  h2: createHeading(3),
  h3: createHeading(4),
  h4: createHeading(5),
  h5: createHeading(6),
  h6: createHeading(6),
  img: CustomImage,
  a: CustomLink,
  pre: Pre,
  code: Code,
  Table,
  blockquote: blockquote,
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