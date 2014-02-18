using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GroundChekka : MonoBehaviour 
{
	Platformer owner;
	public List<Collider2D> floors;

	void Start()
	{
		owner = transform.parent.GetComponent<Platformer>();
	}

	void OnTriggerEnter2D(Collider2D other)
	{
		if(floors.Count <= 0)
			owner.LandOnFloor();

		floors.Add(other);
	}

	void OnTriggerExit2D(Collider2D other)
	{
		floors.Remove(other);

		if(floors.Count <= 0)
			owner.LeaveFloor();
	}
}
