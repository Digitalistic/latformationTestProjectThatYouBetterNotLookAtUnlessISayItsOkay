#pragma strict
function OnGUI () {

	if(GUI.Button(Rect(120,Screen.height-35 - 30,150,25),"Vertical Movement"))
	{
		Application.LoadLevel("VerticalWalking");
	}
	if(GUI.Button(Rect(10,Screen.height-35 - 30,100,25),"2Player Soccer"))
	{
		Application.LoadLevel("TwoPlayerSoccer");
	}
	if(GUI.Button(Rect(10,Screen.height-35,100,25),"Block Level"))
	{
		Application.LoadLevel("testscene");
	}
	if(GUI.Button(Rect(120,Screen.height-35,150,25),"RageSpline Level"))
	{
		Application.LoadLevel("testsceneragespline");
	}
	if(GUI.Button(Rect(280,Screen.height-35,150,25),"Advanced Plattformer"))
	{
		Application.LoadLevel("advancedPlattforming");
	}
	if(GUI.Button(Rect(440,Screen.height-35,80,25),"Speedy"))
	{
		Application.LoadLevel("speedyPlayer");
	}
	if(GUI.Button(Rect(530,Screen.height-35,90,25),"SplitScreen"))
	{
		Application.LoadLevel("splitscreen");
	}
	if(GUI.Button(Rect(630,Screen.height-35,100,25),"DoodleJumpish"))
	{
		Application.LoadLevel("doodlejumpish");
	}
	if(GUI.Button(Rect(740,Screen.height-35,100,25),"Jump Only"))
	{
		Application.LoadLevel("jumponly");
	}
}

