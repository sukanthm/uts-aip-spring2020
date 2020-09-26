import Header from '../../template-parts/Header';
import { useRouter } from 'next/router'
const TaskID = (props) => {
    const router = useRouter()
    const { id } = router.query
    return(
        <>
            <Header />
            <h1>{ id }</h1>
      </>
    )
}

export default TaskID;