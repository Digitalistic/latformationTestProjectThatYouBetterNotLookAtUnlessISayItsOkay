#pragma strict

private var health_js : PlayerHealth;
private var cam_js : PlayerCamera;
function Start()
{
	health_js = GetComponent(PlayerHealth) as PlayerHealth;
	cam_js = GetComponent(PlayerCamera) as PlayerCamera;
}

function OnGUI()
{
Mathf.Abs(cam_js.camera_pointer.camera.pixelRect.y - cam_js.camera_pointer.camera.pixelRect.height);
if(cam_js.camera_pointer)
{
	GUI.Label( Rect(cam_js.camera_pointer.camera.pixelRect.x+cam_js.camera_pointer.camera.pixelWidth-100,Mathf.Abs(cam_js.camera_pointer.camera.pixelRect.y - cam_js.camera_pointer.camera.pixelRect.height)+20,100,20),"Health "+ health_js.health + "/" + health_js.max_health);
	GUI.Label( Rect(cam_js.camera_pointer.camera.pixelRect.x+cam_js.camera_pointer.camera.pixelWidth-100,Mathf.Abs(cam_js.camera_pointer.camera.pixelRect.y - cam_js.camera_pointer.camera.pixelRect.height)+40,100,20),"Lifes "+ health_js.lifes );
}
}
function Update () {
}