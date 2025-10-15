import { motion ,AnimatePresence } from "framer-motion"
import { Navbarmenu } from "../../data/Navbar"

interface ResponsiveProps {
  open: boolean;
}

const Responsive:React.FC<ResponsiveProps> = ({open}) => {
  return (
    <AnimatePresence mode = "wait">
      {
        open && (
          <motion.div
          initial = {{opacity:0, y:-100}}
          animate = {{opacity:1, y:0}}
          exit={{opacity:0, y:-50}}
          transition={{duration : 0.4, ease:"easeOut"}}
          className="fixed top-16 left-0 w-full h-screen z-20 "
          >
            <div className="uppercase  bg-black/50 py-10 m-4 rounded-3xl flex flex-col items-center gap-10 md:hidden">
              {Navbarmenu.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  className="text-white text-xl font-semibold"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </motion.div>
        )
      }

    </AnimatePresence>
  )

}

export default Responsive

