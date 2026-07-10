import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  textClassName?: string
  underlineClassName?: string
  underlinePath?: string
  underlineHoverPath?: string
  underlineDuration?: number
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      className,
      textClassName,
      underlineClassName,
      underlinePath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10",
      underlineHoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10",
      underlineDuration = 1.5,
      ...props
    },
    ref,
  ) => {
    const textRef = React.useRef<HTMLHeadingElement>(null)
    const [textWidth, setTextWidth] = React.useState(300)
    const pathVariants: Variants = {
      hidden: {
        pathLength: 0,
        opacity: 0,
      },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: underlineDuration,
          ease: "easeInOut",
        },
      },
    }

    React.useEffect(() => {
      if (!textRef.current) return

      const updateWidth = () => {
        if (!textRef.current) return
        setTextWidth(Math.max(textRef.current.offsetWidth, 1))
      }
      updateWidth()

      const observer = new ResizeObserver(updateWidth)
      observer.observe(textRef.current)

      return () => observer.disconnect()
    }, [text])

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-2", className)}
        {...props}
      >
        <div className="relative">
          <motion.h2
            ref={textRef}
            className={cn("text-center", textClassName)}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {text}
          </motion.h2>

          <motion.svg
            width={textWidth}
            height="20"
            viewBox={`0 0 ${textWidth} 20`}
            className={cn("absolute -bottom-4 left-0", underlineClassName)}
          >
            <motion.path
              d={`M 0,10 Q ${textWidth * 0.25},0 ${textWidth * 0.5},10 Q ${textWidth * 0.75},20 ${textWidth},10`}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                d: `M 0,10 Q ${textWidth * 0.25},20 ${textWidth * 0.5},10 Q ${textWidth * 0.75},0 ${textWidth},10`,
                transition: { duration: 0.8 },
              }}
            />
          </motion.svg>
        </div>
      </div>
    )
  },
)

AnimatedText.displayName = "AnimatedText"

export { AnimatedText }
