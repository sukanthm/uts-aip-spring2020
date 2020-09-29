import Header from '../../../../template-parts/Header';
import { useRouter } from 'next/router'
const TaskID = (props) => {
    const router = useRouter()
    const { id,rid } = router.query
    return(
        <>
            <Header />
            <h1>{ id }</h1>
            <h2>{ rid }</h2>
      </>
    )
}

export default TaskID;