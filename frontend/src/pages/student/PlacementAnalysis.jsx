import { useEffect,useState } from "react";
import {api} from "../../lib/api";

export default function PlacementAnalysis(){

const [analysis,setAnalysis]=useState([]);

useEffect(()=>{

async function load(){

const student = await api.get("/student/me");

const data = await api.get(
`/student-placement-analysis/${student.id}`
);

setAnalysis(data);

}

load();

},[]);


return (
<div>

<h2>Placement Readiness</h2>


{
analysis.map((item,index)=>(

<div className="job-card" key={index}>

<h3>{item.company}</h3>

<p>
Readiness:
{Math.round(item.readiness_score)}%
</p>

<p>
Status:
{item.status}
</p>


<p>
{
item.eligible 
?
"Eligible ✅"
:
"Missing Skills ❌"
}
</p>


{
item.missing_skills.length>0 &&
<p>
Need:
{item.missing_skills.join(",")}
</p>
}


</div>

))
}


</div>
)

}