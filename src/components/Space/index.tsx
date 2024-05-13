import classNames from 'classnames'
import React from 'react'
import './index.scss'
import { ConfigContext } from './ConfigProvider'

export type SizeType = 'small' | 'middle' | 'large' | number | undefined

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  style?: React.CSSProperties
  size?: SizeType | [SizeType, SizeType]
  direction?: 'horizontal' | 'vertical'
  align?: 'start' | 'end' | 'center' | 'baseline'
  split?: React.ReactNode
  wrap?: boolean
}

function Space(props: SpaceProps) {
  const { space } = React.useContext(ConfigContext)
  console.log(space)

  const {
    className,
    style,
    size = space?.size || 'small',
    direction = 'horizontal',
    align,
    split,
    wrap = false,
    ...rest
  } = props

  // 处理 子元素
  const childNodes = React.Children.toArray(props.children)

  const nodes = childNodes.map((child: any, index: number) => {
    const key = (child && child.key) || `space-item-${index}`

    return (
      <>
        <div
          className='space-item'
          key={key}
        >
          {child}
        </div>

        {index < childNodes.length && split && (
          <span
            className={`${className}-split`}
            style={style}
          >
            {split}
          </span>
        )}
      </>
    )
  })

  // 处理 direction 和 align
  const mergedAlign =
    direction === 'horizontal' && align === undefined ? 'center' : align

  const cn = classNames(
    'space',
    `space-${direction}`,
    {
      [`space-align-${mergedAlign}`]: mergedAlign,
    },
    className
  )

  // 处理 size

  const spaceSize = {
    small: 8,
    middle: 16,
    large: 24,
  }
  function getNumberSize(size: SizeType) {
    return typeof size === 'string' ? spaceSize[size] : size || 0
  }

  const otherStyle: React.CSSProperties = {}

  const [horizontalSize, VerticalSize] = React.useMemo(() => {
    const s = Array.isArray(size) ? size : [size, size]
    return s.map(item => getNumberSize(item))
  }, [size])

  otherStyle.columnGap = horizontalSize
  otherStyle.rowGap = VerticalSize

  if (wrap) {
    otherStyle.flexWrap = 'wrap'
  }

  return (
    <div
      className={cn}
      style={{ ...otherStyle, ...style }}
      {...rest}
    >
      {nodes}
    </div>
  )
}

export default Space