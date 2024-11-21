// Based on https://github.com/vercel/examples/tree/main/solutions/blog

import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from '@/components/Link/Link';
import Text from '@/components/Text/Text';
import Button from '@/components/Button/Button';
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
            <Text>
              {children}
            </Text>
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
  // Markdown likes to pass many things through the <p> tag constructor, but some things we don't want wrapped.
  const passThroughTypes = [CustomImage];

  if( passThroughTypes.indexOf(props.children.type) >= 0 ){
    return props.children;
  } else {
    return (
      <p>
        <Text>{props.children}</Text>
      </p>
    )
  }
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
function HR() {
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
      {props.children.map((item, index) => item.type === 'li' ? (
        <li key={index}>
          <Text>{item.props.children}</Text>
        </li>
      ) : '')}
    </ol>
  )
}

// Unordered List
function UL(props) {
  return (
    <ul className={styles.ul}>
      {props.children.map((item, index) => item.type === 'li' ? (
        <li key={index}>
          <Text>{item.props.children}</Text>
        </li>
      ) : '')}
    </ul>
  )
}

// Figure
function Figure(props) {
  return (
    <figure className={`${styles.figure} ${props.padded ? styles.padded : ''}`}>
      {props.children}
    </figure>
  )
}

// Embedded Video
function Video(props) {
  if( props.youtube ){
    return (
      <div className={styles.video}>
        <iframe
          id="ytplayer"
          type="text/html"
          width="1280"
          height="720"
          src={`https://www.youtube.com/embed/${props.id}?rel=0&loop=1`}
          frameborder="0"
          >
        </iframe>
      </div>
    )
  } else {
    return (
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        >
        <source src={props.src} type="video/mp4"></source>
      </video>
    )
  }
}



/*-------------------------------------------------------*/
/* WRAPPERS & MODIFIERS
/*-------------------------------------------------------*/

// Columns
function Columns(props) {
  return (
    <div className={`${styles.columns} ${props.nowrap ? styles.nowrap : ''}`}>
      {props.children}
    </div>
  )
}

// Grid layout
function Grid(props) {
  return (
    <div className={styles.grid}>
      {props.children}
    </div>
  )
}

// Centered content
function Center(props) {
  return (
    <div className={styles.center}>
      {props.children}
    </div>
  )
}

// Small element
function Small(props) {
  return (
    <div className={styles.small}>
      {props.children}
    </div>
  )
}

// Wide element
function Wide(props) {
  return (
    <div className={styles.wide}>
      {props.children}
    </div>
  )
}

// Full-width element
function Full(props) {
  return (
    <div className={styles.full}>
      {props.children}
    </div>
  )
}

// Device container
function Device(props) {
  return (
    <div className={styles.device}>
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
  Figure,
  Video,
  Button,
  Columns,
  Grid,
  Center,
  Small,
  Wide,
  Full,
  Device
}

export async function CustomMDX(props) {
  return (
    <div className={styles.mdx}>
      <MDXRemote
        {...props}
        components={components}
      />
    </div>
  )
}