var target:GameObject;
function OnTriggerEnter (other : Collider) {
	if(other.transform.tag == "Player")
	{
		target.SetActiveRecursively(true);
	}
}