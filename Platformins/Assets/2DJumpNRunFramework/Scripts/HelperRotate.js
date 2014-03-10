#pragma strict
var rotate : Vector3;
function Update () {
	if(!rigidbody)
		transform.Rotate(rotate * Time.deltaTime);
}

function FixedUpdate () {
	if(rigidbody)
	{
		var deltaRotation : Quaternion = Quaternion.Euler(rotate * Time.deltaTime);
		rigidbody.MoveRotation(rigidbody.rotation * deltaRotation);
	}
}